/**
 * Lógica para la administración de Roles.
 * ------------------------------------------------------------------
 * Propósito:
 *   - Gestionar todo el flujo de CRUD de Roles usando React Query.
 *   - Centralizar la lógica de creación, edición, eliminación y exportación de datos.
 *   - Mantener componentes más limpios y separados de la lógica de negocio.
 *
 * Funcionalidades clave:
 *   - Obtener lista de roles con caché y sincronización automática.
 *   - Validar formularios antes de guardar o actualizar información.
 *   - Controlar estados de edición UI (modo edición activo/inactivo).
 *   - Notificaciones profesionales de éxito/error.
 *   - Exportar datos como archivo Excel generado por la API.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useRoles,
  useCreateRol,
  useUpdateRol,
  useDeleteRol,
  useExportarExcelRoles,
} from "../../../../hooks/useRol";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useRolAdmin = (nuevoRolForm, editRolForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelRoles();
  // Servicio global de notificaciones
  const notify = useAdminNotifier();
  // Consulta principal: obtiene todos los anuncios desde la API
  const { data: rolesData = [], isLoading } = useRoles();
  // Mutaciones CRUD
  const crearRol = useCreateRol();
  const updateRol = useUpdateRol();
  const deleteRol = useDeleteRol();

  // Ordenar roles: primero por fechaRegistro y luego por nombreRol
  const roles = rolesData.slice().sort((a, b) => {
    const dateA = new Date(a.fechaRegistro).getTime();
    const dateB = new Date(b.fechaRegistro).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.nombreRol.localeCompare(b.nombreRol);
  });

  /** Crear rol */
  const handleCrear = async () => {
    if (!(await nuevoRolForm.validate())) {
      notify.validationError();
      return;
    }
    notify.createPromise(
      crearRol
        .mutateAsync(nuevoRolForm.values)
        .then(() => {
          queryClient.invalidateQueries(["rol"]);
          nuevoRolForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  /** Inicia edición cargando datos existentes en el formulario */
  const handleEditar = (rol) => {
    setEditandoId(rol.rolId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editRolForm.setValues({
      nombreRol: rol.nombreRol || "",
      estado: rol.estado ?? true,
    });
  };

  /** Guardar cambios del rol editado */
  const handleGuardar = async () => {
    if (!(await editRolForm.validate())) {
      notify.validationError();
      return;
    }

    const dataEditar = { rolId: editandoId, ...editRolForm.values };

    notify.updatePromise(
      updateRol.mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editRolForm.resetForm();
          queryClient.invalidateQueries(["rol"]);
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  /** Cancelar modo edición sin guardar cambios */
  const handleCancelar = () => {
    setEditandoId(null);
    editRolForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar rol  con confirmación de usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteRol.mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editRolForm.resetForm();
          }

          nuevoRolForm.resetForm();

          queryClient.setQueryData(["roles"], (old) =>
            old ? old.filter((r) => r.rolId !== id) : []
          );

          queryClient.invalidateQueries(["roles"]);
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  /** Exportar la lista de anuncios en un archivo Excel */
  const descargarExcel = () => {
  notify.exportPromise(
    exportarExcel
      .mutateAsync()
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data])
        );

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "roles.xlsx");

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        handleApiError(error, notify);
        throw error; // 🔑 NECESARIO para toast.promise
      })
  );
};


  return {
    roles,
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
