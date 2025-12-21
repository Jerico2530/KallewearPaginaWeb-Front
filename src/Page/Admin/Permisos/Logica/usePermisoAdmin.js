/**
 * Lógica para la administración de Permisos.
 * ------------------------------------------------------------------
 * Propósito:
 *   - Gestionar todo el flujo CRUD de Permisos usando React Query.
 *   - Centralizar la lógica de creación, edición, eliminación y exportación.
 *   - Mantener componentes UI limpios, delegando la lógica de negocio al hook.
 *
 * Funcionalidades clave:
 *   - Obtención de permisos con caché y sincronización automática.
 *   - Validación de formularios antes de crear o actualizar datos.
 *   - Control de estados de edición para UI (modo edición activo/inactivo).
 *   - Notificaciones profesionales de éxito/error.
 *   - Exportación de datos en formato Excel.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  usePermisos,
  useCrearPermiso,
  useUpdatePermiso,
  useDeletePermiso,
  useExportarExcelPermisos,
} from "../../../../hooks/usePermiso";
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const usePermisosAdmin = (nuevoPermisoForm, editPermisoForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelPermisos();
  // Servicio global de notificaciones
  const notify = useNotification();
  // Consulta principal: obtiene todos los anuncios desde la API
  const { data: permisosData = [], isLoading } = usePermisos();
  // Mutaciones CRUD
  const crearPermiso = useCrearPermiso();
  const updatePermiso = useUpdatePermiso();
  const deletePermiso = useDeletePermiso();

  // Ordenar permisos por fecha y nombre para visualización consistente
  const permisos = permisosData.slice().sort((a, b) => {
    const dateA = new Date(a.fechaRegistro).getTime();
    const dateB = new Date(b.fechaRegistro).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.nombrePermiso.localeCompare(b.nombrePermiso);
  });

  /** Crear permiso */
  const handleCrear = async () => {
    // Evita enviar datos inválidos a la API
    if (!(await nuevoPermisoForm.validate())) {
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearPermiso.mutate(nuevoPermisoForm.values, {
      onSuccess: () => {
        notify.success("Permiso creado correctamente");
        queryClient.invalidateQueries(["permiso"]); // sincroniza lista
        nuevoPermisoForm.resetForm(); // limpia formulario
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Inicia edición cargando datos existentes en el formulario */
  const handleEditar = (permiso) => {
    setEditandoId(permiso.permisoId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editPermisoForm.setValues({
      nombrePermiso: permiso.nombrePermiso || "",
      estado: permiso.estado ?? true,
    });
  };

  /** Guardar cambios del anuncio editado */
  const handleGuardar = async () => {
    if (!(await editPermisoForm.validate())) {
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }

    const dataEditar = { permisoId: editandoId, ...editPermisoForm.values };

    updatePermiso.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Permiso actualizado correctamente");
        setEditandoId(null);
        editPermisoForm.resetForm();
        queryClient.invalidateQueries(["permiso"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar modo edición sin guardar cambios */
  const handleCancelar = () => {
    setEditandoId(null);
    editPermisoForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar anuncio con confirmación de usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este permiso?"
    );
    if (!confirmar) return;

    deletePermiso.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Permiso eliminado correctamente");

          // Si el anuncio eliminado estaba siendo editado, reiniciar estado
          if (editandoId === id) {
            setEditandoId(null);
            editPermisoForm.resetForm();
          }

          nuevoPermisoForm.resetForm();
          // Actualiza caché local inmediatamente (optimización de UX)
          queryClient.setQueryData(["permisos"], (old) =>
            old ? old.filter((c) => c.permisoId !== id) : []
          );

          queryClient.invalidateQueries(["permisos"]);
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
      link.setAttribute("download", "permiso.xlsx"); // nombre del archivo

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
    permisos,
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
