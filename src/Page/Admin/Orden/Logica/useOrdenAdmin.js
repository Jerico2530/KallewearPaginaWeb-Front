/**
 * Lógica para la administración de Órdenes.
 * ------------------------------------------------------------------
 * Propósito:
 *  - Centralizar el flujo completo de gestión de órdenes desde el panel
 *    administrativo utilizando React Query.
 *  - Mantener los componentes UI limpios separando la lógica de negocio.
 *  - Validar formularios y gestionar notificaciones profesionales.
 *
 * Funcionalidades clave:
 *  - Consultar y mantener sincronizado el listado de órdenes.
 *  - Crear, modificar y eliminar órdenes, actualizando correctamente la UI.
 *  - Controlar el estado de edición para una experiencia más intuitiva.
 *  - Exportación de datos a Excel.
 *  - Manejo correcto de errores provenientes del servidor.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useOrdenes,
  useCrearOrden,
  useActualizarOrden,
  useEliminarOrden,
  useExportarOrdenes,
} from "../../../../hooks/useOrden";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useOrdenesAdmin = (nuevoOrdenForm, editOrdenForm) => {
  // ID del carrito actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarOrdenes();
  // Servicio centralizado de notificaciones UI
  const notify = useAdminNotifier();
  // Consulta principal de datos del carrito (caché integrada)
  const { data: ordenes, isLoading } = useOrdenes();
  // Mutaciones CRUD
  const crearOrden = useCrearOrden();
  const updateOrden = useActualizarOrden();
  const deleteOrden = useEliminarOrden();

  /** Crear un nuevo registro en orden */
  const handleCrear = async () => {
    // Evita enviar datos inválidos
    if (!(await nuevoOrdenForm.validate())) {
      notify.validationError();
      return;
    }

    notify.createPromise(
      crearOrden
        .mutateAsync(nuevoOrdenForm.values)
        .then(() => {
          queryClient.invalidateQueries(["orden"]);
          nuevoOrdenForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (orden) => {
    setEditandoId(orden.ordenId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editOrdenForm.setValues({
      usuarioId: orden.usuarioId || "",
      sucursalId: orden.sucursalId || "",
      metodoEntrega: orden.metodoEntrega || "",
      direccionId: orden.direccionId || "",
      estado: orden.estado ?? true,
    });
  };

  /** Guardar cambios de edición */
  const handleGuardar = async () => {
    if (!(await editOrdenForm.validate())) {
      notify.validationError();
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { ordenId: editandoId, ...editOrdenForm.values };

    notify.updatePromise(
      updateOrden
        .mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editOrdenForm.resetForm();
          queryClient.invalidateQueries(["orden"]);
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
    editOrdenForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar un carrito con confirmación del orden */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteOrden
        .mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editOrdenForm.resetForm();
          }

          nuevoOrdenForm.resetForm();

          queryClient.setQueryData(["ordenes"], (old) =>
            old ? old.filter((r) => r.ordenId !== id) : []
          );

          queryClient.invalidateQueries(["ordenes"]);
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
          link.setAttribute("download", "orden.xlsx");

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
    ordenes,
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
