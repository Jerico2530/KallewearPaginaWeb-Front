/**
 * Lógica para la administración de Pagos.
 * ------------------------------------------------------------------
 * Propósito:
 *  - Centralizar el flujo completo de gestión de pagos desde el panel
 *    administrativo utilizando React Query.
 *  - Mantener los componentes UI limpios separando la lógica de negocio.
 *  - Validar formularios y gestionar notificaciones profesionales.
 *
 * Funcionalidades clave:
 *  - Consultar y mantener sincronizado el listado de pagos.
 *  - Crear, modificar y eliminar pagos, actualizando correctamente la UI.
 *  - Controlar el estado de edición para una experiencia más intuitiva.
 *  - Exportar pagos a Excel de manera dinámica.
 *  - Manejo correcto de errores provenientes del servidor.
 */

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  usePagos,
  useCreatePago,
  useUpdatePago,
  useDeletePago,
  useExportarExcelPagos,
} from "../../../../hooks/usePago";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const usePagosAdmin = (nuevoPagoForm, editPagoForm) => {
  // ID del carrito actualmente en edición (control de modo edición
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelPagos();
  // Servicio centralizado de notificaciones UI
  const notify = useAdminNotifier();
  // Consulta principal de datos del carrito (caché integrada)
  const { data: pagos, isLoading } = usePagos();
  // Mutaciones CRUD
  const crearPago = useCreatePago();
  const updatePago = useUpdatePago();
  const deletePago = useDeletePago();

  /** Crear un nuevo registro en Carrito de Compra */
  const handleCrear = async () => {
    // Evita enviar datos inválidos
    if (!(await nuevoPagoForm.validate())) {
      notify.validationError();
      return;
    }

    notify.createPromise(
      crearPago
        .mutateAsync(nuevoPagoForm.values)
        .then(() => {
          queryClient.invalidateQueries(["pago"]);
          nuevoPagoForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (pago) => {
    setEditandoId(pago.pagoId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editPagoForm.setValues({
      ordenId: pago.ordenId || "",
      medioPagoId: pago.medioPagoId || "",
      CodigoOperacion: pago.CodigoOperacion || "",
      estado: pago.estado ?? true,
    });
  };

  /** Guardar cambios de edición */
  const handleGuardar = async () => {
    if (!(await editPagoForm.validate())) {
      notify.validationError();
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { pagoId: editandoId, ...editPagoForm.values };

    notify.updatePromise(
      updatePago
        .mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editPagoForm.resetForm();
          queryClient.invalidateQueries(["pago"]);
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
    editPagoForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar un carrito con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deletePago
        .mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editPagoForm.resetForm();
          }

          nuevoPagoForm.resetForm();

          queryClient.setQueryData(["pagos"], (old) =>
            old ? old.filter((r) => r.pagoId !== id) : []
          );

          queryClient.invalidateQueries(["pagos"]);
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
          link.setAttribute("download", "pago.xlsx");

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
    pagos,
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
