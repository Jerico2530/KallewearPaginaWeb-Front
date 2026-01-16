/**
 * Lógica para la administración de Permisos de Rol.
 * ------------------------------------------------------------------
 * Propósito:
 *  - Centralizar el flujo completo de gestión de permisos de rol desde el panel
 *    administrativo utilizando React Query.
 *  - Mantener los componentes UI limpios separando la lógica de negocio.
 *  - Validar formularios y gestionar notificaciones profesionales.
 *
 * Funcionalidades clave:
 *  - Consultar y mantener sincronizado el listado de PermRoles.
 *  - Crear, modificar y eliminar permisos de rol, actualizando correctamente la UI.
 *  - Controlar el estado de edición para una experiencia más intuitiva.
 *  - Manejo correcto de errores provenientes del servidor.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  usePermRoles,
  useCreatePermRole,
  useUpdatePermRole,
  useDeletePermRole,
  useExportarExcelPermRoles,
} from "../../../../hooks/usePermRol";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const usePermRolAdmin = (nuevoPermRolForm, editPermRolForm) => {
  // ID del PermRol actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelPermRoles();
  // Servicio centralizado de notificaciones UI
  const notify = useAdminNotifier();
  // Consulta principal de datos del carrito (caché integrada)
  const { data: permRoles = [], isLoading } = usePermRoles();
  // Mutaciones CRUD
  const crearPermRol = useCreatePermRole();
  const updatePermRol = useUpdatePermRole();
  const deletePermRol = useDeletePermRole();

  /** Crear un nuevo registro en PermRol */
  const handleCrear = async () => {
    // Evita enviar datos inválidos
    if (!(await nuevoPermRolForm.validate())) {
      notify.validationError();
      return;
    }
    notify.createPromise(
      crearPermRol
        .mutateAsync(nuevoPermRolForm.values)
        .then(() => {
          queryClient.invalidateQueries(["permRoles"]);
          nuevoPermRolForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (permRol) => {
    setEditandoId(permRol.permRolId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editPermRolForm.setValues({
      permisoId: permRol.permisoId || "",
      rolId: permRol.rolId || "",
      estado: permiso.estado ?? true,
    });
  };

  /** Guardar cambios de edición */
  const handleGuardar = async () => {
    if (!(await editPermRolForm.validate())) {
      notify.validationError();
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { permRolId: editandoId, ...editPermRolForm.values };

    notify.updatePromise(
      updatePermRol
        .mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editPermRolForm.resetForm();
          queryClient.invalidateQueries(["permRoles"]);
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
    editPermRolForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar un carrito con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deletePermRol
        .mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editPermRolForm.resetForm();
          }

          nuevoPermRolForm.resetForm();

          queryClient.setQueryData(["permRoles"], (old) =>
            old ? old.filter((r) => r.permRolId !== id) : []
          );

          queryClient.invalidateQueries(["permRoles"]);
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  /** Descargar Excel */
  const descargarExcel = async () => {
    notify.exportPromise(
      exportarExcel
        .mutateAsync()
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "permRol.xlsx");

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
    permRoles,
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
