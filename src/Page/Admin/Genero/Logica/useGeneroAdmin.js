/**
 * Lógica para la administración de Géneros.
 *
 * Propósito:
 *  - Gestionar el flujo completo de CRUD de Géneros usando React Query.
 *  - Centralizar la lógica de creación, edición, eliminación y exportación.
 *  - Mantener la UI limpia separando la lógica de negocio en un hook reutilizable.
 *
 * Funcionalidades clave:
 *  - Cargar lista de géneros con caché y sincronización automática.
 *  - Validar formularios antes de guardar o editar datos.
 *  - Controlar estados de edición y UI (activar/desactivar edición).
 *  - Notificaciones profesionales de éxito/error/confirmación.
 *  - Exportar datos en formato Excel mediante API.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGeneros,
  useCrearGenero,
  useActualizarGenero,
  useEliminarGenero,
  useExportarExcelGeneros,
} from "../../../../hooks/useGenero";
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useGenerosAdmin = (nuevoGeneroForm, editGeneroForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelGeneros();
  // Servicio global de notificaciones
  const notify = useNotification();
  // Consulta principal: obtiene todos los anuncios desde la API
  const { data: generos = [], isLoading } = useGeneros();
  // Mutaciones CRUD
  const crearGenero = useCrearGenero();
  const updateGenero = useActualizarGenero();
  const deleteGenero = useEliminarGenero();

  /** Crear Genero */
  const handleCrear = async () => {
    // Evita enviar datos inválidos a la API
    if (!(await nuevoGeneroForm.validate())) {
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearGenero.mutate(nuevoGeneroForm.values, {
      onSuccess: () => {
        notify.success("Genero creado correctamente");
        queryClient.invalidateQueries(["Genero"]);
        nuevoGeneroForm.resetForm();
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Inicia edición cargando datos existentes en el formulario */
  const handleEditar = (genero) => {
    setEditandoId(genero.generoId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editGeneroForm.setValues({
      tipo: genero.tipo || "",
      estado: genero.estado ?? true,
    });
  };

  /** Guardar cambios del anuncio editado */
  const handleGuardar = async () => {
    if (!(await editGeneroForm.validate())) {
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }

    const dataEditar = { generoId: editandoId, ...editGeneroForm.values };

    updateGenero.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Genero actualizado correctamente");
        setEditandoId(null);
        editGeneroForm.resetForm();
        queryClient.invalidateQueries(["Genero"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar modo edición sin guardar cambios */
  const handleCancelar = () => {
    setEditandoId(null);
    editGeneroForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar anuncio con confirmación de usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este genero?"
    );
    if (!confirmar) return;

    deleteGenero.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Genero eliminado correctamente");

          // Si el anuncio eliminado estaba siendo editado, reiniciar estado
          if (editandoId === id) {
            setEditandoId(null);
            editGeneroForm.resetForm();
          }

          nuevoGeneroForm.resetForm();
          // Actualiza caché local inmediatamente (optimización de UX)
          queryClient.setQueryData(["generos"], (old) =>
            old ? old.filter((c) => c.generoId !== id) : []
          );

          queryClient.invalidateQueries(["generos"]);
        }
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Exportar la lista de anuncios en un archivo Excel */
  const descargarExcel = async () => {
    try {
      const response = await exportarExcel.mutateAsync();

      // Crear el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un link temporal
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "genero.xlsx"); // nombre del archivo

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
    generos,
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
