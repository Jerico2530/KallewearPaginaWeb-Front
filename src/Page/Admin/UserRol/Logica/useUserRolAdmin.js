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
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useUserRolesAdmin = (nuevoUserRolForm, editUserRolForm) => {
  // ID del carrito actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelUserRoles();
  // Servicio centralizado de notificaciones UI
  const notify = useNotification();
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
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearUserRol.mutate(nuevoUserRolForm.values, {
      onSuccess: () => {
        notify.success("UserRol creado correctamente");
        queryClient.invalidateQueries(["userRol"]); // sincroniza la vista
        nuevoUserRolForm.resetForm(); // limpia campos
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (userRol) => {
    setEditandoId(userRol.userRolId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editUserRolForm.setValues({
      usuarioId: userRol.usuarioId || "",
      rolId: userRol.rolId || "",
      estado: userRol.estado ?? true,
    });
  };

  /** Guardar cambios */
  const handleGuardar = async () => {
    if (!(await editUserRolForm.validate())) {
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { userRolId: editandoId, ...editUserRolForm.values };

    updateUserRol.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("UserRol actualizado correctamente");
        setEditandoId(null);
        editUserRolForm.resetForm();
        queryClient.invalidateQueries(["userRol"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editUserRolForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar userRol */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este userRol?"
    );
    if (!confirmar) return;

    deleteUserRol.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("UserRol eliminado correctamente");
          // Si el elemento eliminado estaba en edición, salir del modo edición
          if (editandoId === id) {
            setEditandoId(null);
            editUserRolForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoUserRolForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["userRoles"], (old) =>
            old ? old.filter((c) => c.userRolId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["userRoles"]);
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
      link.setAttribute("download", "userRol.xlsx"); // nombre del archivo

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
