/**
 * Logica para la administración de Anuncios.
 *
 * Propósito:
 *  - Gestionar todo el flujo de CRUD de Anuncios usando React Query.
 *  - Centralizar la lógica de creación, edición, eliminación y exportación de datos.
 *  - Mantener componentes más limpios y separados de la lógica de negocio.
 *
 * Funcionalidades clave:
 *  - Obtener lista de anuncios con caché y sincronización automática.
 *  - Validar formularios antes de guardar o actualizar información.
 *  - Controlar estados de edición UI (modo edición activo/inactivo).
 *  - Notificaciones profesionales de éxito/error.
 *  - Exportar datos como archivo Excel generado por la API.
 *
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAnuncios,
  useCrearAnuncio,
  useUpdateAnuncio,
  useDeleteAnuncio,
  useExportarExcelAnuncios,
} from "../../../../hooks/useAnuncio";
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useAnunciosAdmin = (nuevoAnuncioForm, editAnuncioForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelAnuncios();
  // Servicio global de notificaciones
  const notify = useNotification();
  // Consulta principal: obtiene todos los anuncios desde la API
  const { data: anuncios = [], isLoading } = useAnuncios();
  // Mutaciones CRUD
  const crearAnuncio = useCrearAnuncio();
  const updateAnuncio = useUpdateAnuncio();
  const deleteAnuncio = useDeleteAnuncio();

  /** Crear Anuncio */
  const handleCrear = async () => {
    // Evita enviar datos inválidos a la API
    if (!(await nuevoAnuncioForm.validate())) {
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearAnuncio.mutate(nuevoAnuncioForm.values, {
      onSuccess: () => {
        notify.success("Anuncio creado correctamente");
        queryClient.invalidateQueries(["anuncios"]); // sincroniza lista
        nuevoAnuncioForm.resetForm(); // limpia formulario
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Inicia edición cargando datos existentes en el formulario */
  const handleEditar = (anuncio) => {
    setEditandoId(anuncio.anuncioId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editAnuncioForm.setValues({
      titulo: anuncio.titulo || "",
      descripcion: anuncio.descripcion || "",
      imagen: anuncio.imagen || "",
      fechaInicio: anuncio.fechaInicio?.substring(0, 10) || "",
      fechaFinal: anuncio.fechaFinal?.substring(0, 10) || "",
      orden: anuncio.orden,
      estado: anuncio.estado ?? true,
    });
  };

  /** Guardar cambios del anuncio editado */
  const handleGuardar = async () => {
    if (!(await editAnuncioForm.validate())) {
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { anuncioId: editandoId, ...editAnuncioForm.values };

    updateAnuncio.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Anuncio actualizado correctamente");
        setEditandoId(null);
        editAnuncioForm.resetForm();
        queryClient.invalidateQueries(["anuncios"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar modo edición sin guardar cambios */
  const handleCancelar = () => {
    setEditandoId(null);
    editAnuncioForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar anuncio con confirmación de usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este Anuncio?"
    );
    if (!confirmar) return;

    deleteAnuncio.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Anuncio eliminado correctamente");

          // Si el anuncio eliminado estaba siendo editado, reiniciar estado
          if (editandoId === id) {
            setEditandoId(null);
            editAnuncioForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoAnuncioForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["anuncios"], (old) =>
            old ? old.filter((c) => c.anuncioId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["anuncios"]);
        }
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Exportar la lista de anuncios en un archivo Excel */
  const descargarExcel = async () => {
    try {
      const response = await exportarExcel.mutateAsync();

      // Convertir la respuesta binaria en archivo descargable
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un link temporal
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "anuncio.xlsx"); // nombre del archivo

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      notify.success("Excel descargado correctamente");
    } catch (err) {
      notify.error("Error al descargar el Excel");
    }
  };

  return {
    anuncios,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  };
};
