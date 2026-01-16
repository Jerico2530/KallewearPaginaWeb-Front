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
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const usePermisosAdmin = (nuevoPermisoForm, editPermisoForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelPermisos();
  // Servicio global de notificaciones
  const notify = useAdminNotifier();
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
      notify.validationError();
      return;
    }
    notify.createPromise(
      crearPermiso.mutateAsync(nuevoPermisoForm.values)
        .then(() => {
          queryClient.invalidateQueries(["permiso"]);
          nuevoPermisoForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
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
      notify.validationError(); 
      return;
    }

    const dataEditar = { permisoId: editandoId, ...editPermisoForm.values };

     notify.updatePromise(
      updatePermiso.mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editPermisoForm.resetForm();
          queryClient.invalidateQueries(["permiso"]);
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  /** Cancelar modo edición sin guardar cambios */
  const handleCancelar = () => {
    setEditandoId(null);
    editPermisoForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar anuncio con confirmación de usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deletePermiso.mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editPermisoForm.resetForm();
          }

          nuevoPermisoForm.resetForm();

          queryClient.setQueryData(["permisos"], (old) =>
            old ? old.filter((u) => u.permisoId !== id) : []
          );

          queryClient.invalidateQueries(["permisos"]);
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  }; 

  /** Exportar la lista de anuncios en un archivo Excel */
  const descargarExcel = async () => {
     notify.exportPromise(
    exportarExcel
      .mutateAsync()
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data])
        );

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "permiso.xlsx");

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        handleApiError(error, notify);
        throw error; 
      })
  );
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
