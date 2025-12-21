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
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const usePermRolAdmin = (nuevoPermRolForm, editPermRolForm) => {
  // ID del PermRol actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelPermRoles();
  // Servicio centralizado de notificaciones UI
  const notify = useNotification();
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
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearPermRol.mutate(nuevoPermRolForm.values, {
      onSuccess: () => {
        notify.success("PermRol creado correctamente");
        queryClient.invalidateQueries(["permRoles"]); // sincroniza la vista
        nuevoPermRolForm.resetForm(); // limpia campos
      },
      onError: (error) => handleApiError(error, notify),
    });
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
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { permRolId: editandoId, ...editPermRolForm.values };

    updatePermRol.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("PermRol actualizado correctamente");
        setEditandoId(null);
        editPermRolForm.resetForm();
        queryClient.invalidateQueries(["permRoles"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editPermRolForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar un carrito con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este permiso Rol?"
    );
    if (!confirmar) return;

    deletePermRol.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("PermRol eliminado correctamente");

          // Si el elemento eliminado estaba en edición, salir del modo edición
          if (editandoId === id) {
            setEditandoId(null);
            editPermRolForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoPermRolForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["permRoles"], (old) =>
            old ? old.filter((c) => c.permRolId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["permRoles"]);
        }
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Descargar Excel */
  const descargarExcel = async () => {
    try {
      const response = await exportarExcel.mutateAsync();

      // Crear el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un link temporal
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "permRol.xlsx"); // nombre del archivo

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
