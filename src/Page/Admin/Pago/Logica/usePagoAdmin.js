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
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const usePagosAdmin = (nuevoPagoForm, editPagoForm) => {
  // ID del carrito actualmente en edición (control de modo edición
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelPagos();
  // Servicio centralizado de notificaciones UI
  const notify = useNotification();
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
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearPago.mutate(nuevoPagoForm.values, {
      onSuccess: () => {
        notify.success("Pago creado correctamente");
        queryClient.invalidateQueries(["pago"]); // sincroniza la vista
        nuevoPagoForm.resetForm(); // limpia campos
      },
      onError: (error) => handleApiError(error, notify),
    });
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
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { pagoId: editandoId, ...editPagoForm.values };

    updatePago.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Pago actualizado correctamente");
        setEditandoId(null);
        editPagoForm.resetForm();
        queryClient.invalidateQueries(["pago"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editPagoForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar un carrito con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este pago?"
    );
    if (!confirmar) return;

    deletePago.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Pago eliminado correctamente");

          // Si el elemento eliminado estaba en edición, salir del modo edición
          if (editandoId === id) {
            setEditandoId(null);
            editPagoForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoPagoForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["pagos"], (old) =>
            old ? old.filter((c) => c.pagoId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["pagos"]);
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
      link.setAttribute("download", "pago.xlsx"); // nombre del archivo

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
