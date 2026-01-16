/**
 * Lógica para la administración de UserRoles
 * ------------------------------------------------------------------
 * Propósito:
 *  - Centralizar el flujo completo de gestión de UserRoles desde el panel
 *    administrativo utilizando React Query.
 *  - Mantener los componentes UI limpios separando la lógica de negocio.
 *  - Validar formularios y gestionar notificaciones profesionales.
 *
 * Funcionalidades clave:
 *  - Consultar y mantener sincronizado el listado de UserRoles.
 *  - Crear, modificar y eliminar registros, actualizando correctamente la UI.
 *  - Controlar el estado de edición para una experiencia más intuitiva.
 *  - Exportación a Excel y manejo correcto de errores provenientes del servidor.
 */

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUserRoles,
  useCreateUserRole,
  useUpdateUserRole,
  useDeleteUserRole,
  useExportarExcelUserRoles,
} from "../../../../hooks/useUserRole";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useUserRolesAdmin = (nuevoUserRolForm, editUserRolForm) => {
  // ID del carrito actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelUserRoles();
  // Servicio centralizado de notificaciones UI
  const notify = useAdminNotifier();
  // Consulta principal de datos del carrito (caché integrada)
  const { data: userRoles = [], isLoading } = useUserRoles();
  // Mutaciones CRUD
  const crearUserRol = useCreateUserRole();
  const updateUserRol = useUpdateUserRole();
  const deleteUserRol = useDeleteUserRole();

  /** Crear userRol */
  const handleCrear = async () => {
    // Evita enviar datos inválidos
    if (!(await nuevoUserRolForm.validate())) {
      notify.validationError();
      return;
    }

    notify.createPromise(
      crearUserRol
        .mutateAsync(nuevoUserRolForm.values)
        .then(() => {
          queryClient.invalidateQueries(["userRol"]);
          nuevoUserRolForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (userRol) => {
    setEditandoId(userRol.userRolId);

    editUserRolForm.setValues({
      usuarioId: userRol.usuarioId || "",
      rolId: userRol.rolId || "",
      estado: userRol.estado ? "true" : "false", // 🔑 CLAVE
    });
  };

  /** Guardar cambios */
  const handleGuardar = async () => {
    if (!(await editUserRolForm.validate())) {
      notify.validationError();
      return;
    }

    const dataEditar = { userRolId: editandoId, ...editUserRolForm.values };

    notify.updatePromise(
      updateUserRol
        .mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editUserRolForm.resetForm();
          queryClient.invalidateQueries(["userRol"]);
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editUserRolForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar userRol */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteUserRol
        .mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editUserRolForm.resetForm();
          }

          nuevoUserRolForm.resetForm();

          queryClient.setQueryData(["userRoles"], (old) =>
            old ? old.filter((r) => r.userRolId !== id) : []
          );

          queryClient.invalidateQueries(["userRoles"]);
        })
        .catch((error) => {
          handleApiError(error, notify);
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
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "userRol.xlsx");

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
    userRoles,
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
