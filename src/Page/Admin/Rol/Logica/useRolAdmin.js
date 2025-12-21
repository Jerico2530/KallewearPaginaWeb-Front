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
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useRolAdmin = (nuevoRolForm, editRolForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelRoles();
  // Servicio global de notificaciones
  const notify = useNotification();
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
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearRol.mutate(nuevoRolForm.values, {
      // Evita enviar datos inválidos a la API
      onSuccess: () => {
        notify.success("Rol creado correctamente");
        queryClient.invalidateQueries(["rol"]);// sincroniza lista
        nuevoRolForm.resetForm();// limpia formulario
      },
      onError: (error) => handleApiError(error, notify),
    });
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
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { rolId: editandoId, ...editRolForm.values };

    updateRol.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Rol actualizado correctamente");
        setEditandoId(null);
        editRolForm.resetForm();
        queryClient.invalidateQueries(["rol"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar modo edición sin guardar cambios */
  const handleCancelar = () => {
    setEditandoId(null);
    editRolForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar rol  con confirmación de usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este rol?"
    );
    if (!confirmar) return;

    deleteRol.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Rol eliminado correctamente");

          // Si el anuncio eliminado estaba siendo editado, reiniciar estado
          if (editandoId === id) {
            setEditandoId(null);
            editRolForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoRolForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["roles"], (old) =>
            old ? old.filter((c) => c.rolId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["roles"]);
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
      link.setAttribute("download", "rol.xlsx"); // nombre del archivo

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
