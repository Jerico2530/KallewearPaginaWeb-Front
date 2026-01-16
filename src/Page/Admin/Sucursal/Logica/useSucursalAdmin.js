/**
 * Lógica para la administración de Sucursales
 * ------------------------------------------------------------------
 * Propósito:
 *  - Gestionar todo el flujo de CRUD de Sucursales usando React Query.
 *  - Centralizar la lógica de creación, edición, eliminación y exportación de datos.
 *  - Mantener componentes más limpios y separados de la lógica de negocio.
 *
 * Funcionalidades clave:
 *  - Obtener lista de sucursales con caché y sincronización automática.
 *  - Validar formularios antes de guardar o actualizar información.
 *  - Controlar estados de edición UI (modo edición activo/inactivo).
 *  - Notificaciones profesionales de éxito/error.
 *  - Exportar datos como archivo Excel generado por la API.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useSucursales,
  useCreateSucursal,
  useUpdateSucursal,
  useDeleteSucursal,
  useExportarExcelSucursales,
} from "../../../../hooks/useSucursal";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useSucursalAdmin = (nuevoSucursalForm, editSucursalForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelSucursales();
  // Servicio global de notificaciones
  const notify = useAdminNotifier();
  // Consulta principal: obtiene todos los anuncios desde la API
  const { data: sucursalsData = [], isLoading } = useSucursales();
  // Mutaciones CRUD
  const crearSucursal = useCreateSucursal();
  const updateSucursal = useUpdateSucursal();
  const deleteSucursal = useDeleteSucursal();

  // Lista ordenada de sucursales (por fecha y nombre)
  const Sucursales = sucursalsData.slice().sort((a, b) => {
    const dateA = new Date(a.fechaRegistro).getTime();
    const dateB = new Date(b.fechaRegistro).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.locales.localeCompare(b.locales);
  });

  /** Crear sucursal */
  const handleCrear = async () => {
    // Evita enviar datos inválidos a la API
    if (!(await nuevoSucursalForm.validate())) {
      notify.validationError();
      return;
    }

    notify.createPromise(
      crearSucursal
        .mutateAsync(nuevoSucursalForm.values)
        .then(() => {
          queryClient.invalidateQueries(["sucursales"]);
          nuevoSucursalForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };
  /** Inicia edición cargando datos existentes en el formulario */
  const handleEditar = (sucursal) => {
    setEditandoId(sucursal.sucursalId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editSucursalForm.setValues({
      locales: sucursal.locales || "",
      descripcion: sucursal.descripcion || "",
      estado: sucursal.estado ?? true,
    });
  };

  /** Guardar cambios */
  const handleGuardar = async () => {
    if (!(await editSucursalForm.validate())) {
      notify.validationError();
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { sucursalId: editandoId, ...editSucursalForm.values };

    notify.updatePromise(
      updateSucursal
        .mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editSucursalForm.resetForm();
          queryClient.invalidateQueries(["sucursales"]);
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
    editSucursalForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar sucursal con confirmación de usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteSucursal
        .mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editSucursalForm.resetForm();
          }

          nuevoSucursalForm.resetForm();

          queryClient.setQueryData(["sucursales"], (old) =>
            old ? old.filter((u) => u.sucursalId !== id) : []
          );

          queryClient.invalidateQueries(["sucursales"]);
        })
        .catch((error) => {
          handleApiError(error);
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
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "sucursal.xlsx");

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
    Sucursales,
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
