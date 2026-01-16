/**
 * Lógica para la administración de Medios de Pago.
 * ------------------------------------------------------------------
 * Propósito del módulo:
 *  - Centralizar toda la gestión de Medio de Pago desde el panel administrativo.
 *  - Desacoplar la lógica de negocio de los componentes visuales para mantener
 *    una arquitectura más limpia y escalable.
 *  - Integrar validaciones y manejo de notificaciones de usuario.
 *
 * Funcionalidades clave:
 *  - Consultar y mantener sincronizados los medios de pago.
 *  - Crear, actualizar y eliminar, asegurando coherencia en la caché.
 *  - Administrar el estado de edición para mejorar la experiencia de uso.
 *  - Exportar la información a Excel con una acción independiente del CRUD.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useMedioPagos,
  useCrearMedioPago,
  useActualizarMedioPago,
  useEliminarMedioPago,
  useExportarExcelMedioPagos,
} from "../../../../hooks/useMedioPago";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useMedioPagosAdmin = (nuevoMedioPagoForm, editMedioPagoForm) => {
  // ID del carrito actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelMedioPagos();
  // Servicio centralizado de notificaciones UI
  const notify = useAdminNotifier();
  // Consulta principal de datos del carrito (caché integrada)
  const { data: medioPagosData = [], isLoading } = useMedioPagos();
  // Mutaciones CRUD
  const crearMedioPago = useCrearMedioPago();
  const updateMedioPago = useActualizarMedioPago();
  const deleteMedioPago = useEliminarMedioPago();
  // Ordenamiento seguro para una presentación coherente en UI
  const medioPagos = medioPagosData.slice().sort((a, b) => {
    const dateA = new Date(a.fechaRegistro).getTime();
    const dateB = new Date(b.fechaRegistro).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.descripcionMedioPago.localeCompare(b.descripcionMedioPago);
  });

  /** Crear un nuevo registro en Medio Pago */
  const handleCrear = async () => {
    // Evita enviar datos inválidos
    if (!(await nuevoMedioPagoForm.validate())) {
      notify.validationError();
      return;
    }

    notify.createPromise(
      crearMedioPago
        .mutateAsync(nuevoMedioPagoForm.values)
        .then(() => {
          queryClient.invalidateQueries(["medioPago"]);
          nuevoMedioPagoForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };
  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (medioPago) => {
    setEditandoId(medioPago.medioPagoId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editMedioPagoForm.setValues({
      tipoPagoId: medioPago.tipoPagoId || "",
      descripcionMedioPago: medioPago.descripcionMedioPago || "",
      estado: medioPago.estado ?? true,
    });
  };

  /** Guardar cambios de edición */
  const handleGuardar = async () => {
    if (!(await editMedioPagoForm.validate())) {
      notify.validationError();
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { medioPagoId: editandoId, ...editMedioPagoForm.values };

    notify.updatePromise(
      updateMedioPago
        .mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editMedioPagoForm.resetForm();
          queryClient.invalidateQueries(["medioPago"]);
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
    editMedioPagoForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar un carrito con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteMedioPago
        .mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editMedioPagoForm.resetForm();
          }

          nuevoMedioPagoForm.resetForm();

          queryClient.setQueryData(["medioPagos"], (old) =>
            old ? old.filter((r) => r.medioPagoId !== id) : []
          );

          queryClient.invalidateQueries(["medioPagos"]);
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
          link.setAttribute("download", "medioPago.xlsx");

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
    medioPagos,
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
