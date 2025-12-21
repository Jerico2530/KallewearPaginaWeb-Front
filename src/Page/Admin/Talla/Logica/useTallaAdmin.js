/**
 * Lógica para la administración de Tallas.
 * ------------------------------------------------------------------
 * Propósito:
 *  - Gestionar todo el flujo de CRUD de Tallas usando React Query.
 *  - Centralizar la lógica de creación, edición, eliminación y exportación de datos.
 *  - Mantener los componentes de UI limpios y separados de la lógica de negocio.
 *
 * Funcionalidades clave:
 *  - Obtener lista de tallas con caché y sincronización automática.
 *  - Validar formularios antes de guardar o actualizar información.
 *  - Controlar estados de edición UI (modo edición activo/inactivo).
 *  - Notificaciones profesionales de éxito/error.
 *  - Exportar datos como archivo Excel generado por la API.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useTallas,
  useCreateTalla,
  useUpdateTalla,
  useDeleteTalla,
  useExportarExcelTallas,
} from "../../../../hooks/useTalla";
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useTallasAdmin = (nuevoTallaForm, editTallaForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelTallas();
  // Servicio global de notificaciones
  const notify = useNotification();
  // Consulta principal: obtiene todos los anuncios desde la API
  const { data: tallasData = [], isLoading } = useTallas();
  // Mutaciones CRUD
  const crearTalla = useCreateTalla();
  const updateTalla = useUpdateTalla();
  const deleteTalla = useDeleteTalla();
  // Lista ordenada de tallas por fechaRegistro y tipoTalla
  const tallas = tallasData.slice().sort((a, b) => {
    const dateA = new Date(a.fechaRegistro).getTime();
    const dateB = new Date(b.fechaRegistro).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.tipoTalla.localeCompare(b.tipoTalla);
  });

  /** Crear talla */
  const handleCrear = async () => {
    // Evita enviar datos inválidos a la API
    if (!(await nuevoTallaForm.validate())) {
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearTalla.mutate(nuevoTallaForm.values, {
      onSuccess: () => {
        notify.success("Talla creado correctamente");
        queryClient.invalidateQueries(["talla"]); // sincroniza lista
        nuevoTallaForm.resetForm();// limpia formulario
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Inicia edición cargando datos existentes en el formulario */
  const handleEditar = (talla) => {
    setEditandoId(talla.tallaId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editTallaForm.setValues({
      tipoTalla: talla.tipoTalla || "",
      descripcion: talla.descripcion || "",
      estado: talla.estado ?? true,
    });
  };

  /** Guardar cambios */
  const handleGuardar = async () => {
    if (!(await editTallaForm.validate())) {
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { tallaId: editandoId, ...editTallaForm.values };

    updateTalla.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Talla actualizado correctamente");
        setEditandoId(null);
        editTallaForm.resetForm();
        queryClient.invalidateQueries(["talla"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar modo edición sin guardar cambios */
  const handleCancelar = () => {
    setEditandoId(null);
    editTallaForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar talla */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este talla?"
    );
    if (!confirmar) return;

    deleteTalla.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Talla eliminado correctamente");

          // Si el anuncio eliminado estaba siendo editado, reiniciar estado
          if (editandoId === id) {
            setEditandoId(null);
            editTallaForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoTallaForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["tallas"], (old) =>
            old ? old.filter((c) => c.tallaId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["tallas"]);
        }
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Exportar la lista de anuncios en un archivo Excel */
  const descargarExcel = async () => {
    try {
      const response = await exportarExcel.mutateAsync();
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "talla.xlsx");

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
    tallas,
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
