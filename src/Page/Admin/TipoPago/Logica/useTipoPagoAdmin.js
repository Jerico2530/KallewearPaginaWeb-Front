/**
 * Lógica para la administración de TipoPagos.
 * ------------------------------------------------------------------
 * Propósito:
 *  - Gestionar todo el flujo de CRUD de TipoPagos usando React Query.
 *  - Centralizar la lógica de creación, edición, eliminación y exportación de datos.
 *  - Mantener componentes más limpios y separados de la lógica de negocio.
 *
 * Funcionalidades clave:
 *  - Obtener lista de tipoPagos con caché y sincronización automática.
 *  - Validar formularios antes de guardar o actualizar información.
 *  - Controlar estados de edición UI (modo edición activo/inactivo).
 *  - Notificaciones profesionales de éxito/error.
 *  - Exportar datos como archivo Excel generado por la API.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useTipoPagos,
  useCrearTipoPagoso,
  useActualizarTipoPagos,
  useEliminarTipoPagos,
  useExportarExcelTipoPagos,
} from "../../../../hooks/useTipoPago";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useTipoPagosAdmin = (nuevoTipoPagoForm, editTipoPagoForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelTipoPagos();
  // Servicio global de notificaciones
  const notify = useAdminNotifier();
  // Consulta principal: obtiene todos los anuncios desde la API
  const { data: tipoPagosData = [], isLoading } = useTipoPagos();
  // Mutaciones CRUD
  const crearTipoPago = useCrearTipoPagoso();
  const updateTipoPago = useActualizarTipoPagos();
  const deleteTipoPago = useEliminarTipoPagos();

  // Ordenar tipoPagos: primero por fecha, luego por descripción
  const tipoPagos = tipoPagosData.slice().sort((a, b) => {
    const dateA = new Date(a.fechaRegistro).getTime();
    const dateB = new Date(b.fechaRegistro).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.descripcionTipoPago.localeCompare(b.descripcionTipoPago);
  });

  /** Crear tipoPago */
  const handleCrear = async () => {
    // Evita enviar datos inválidos a la API
    if (!(await nuevoTipoPagoForm.validate())) {
      notify.validationError();
      return;
    }

    notify.createPromise(
      crearTipoPago
        .mutateAsync(nuevoTipoPagoForm.values)
        .then(() => {
          queryClient.invalidateQueries(["tipoPago"]);
          nuevoTipoPagoForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  /** Inicia edición cargando datos existentes en el formulario */
  const handleEditar = (tipoPago) => {
    setEditandoId(tipoPago.tipoPagoId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editTipoPagoForm.setValues({
      descripcionTipoPago: tipoPago.descripcionTipoPago || "",
      estado: tipoPago.estado ?? true,
    });
  };

  /** Guardar cambios */
  const handleGuardar = async () => {
    if (!(await editTipoPagoForm.validate())) {
      notify.validationError();
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { tipoPagoId: editandoId, ...editTipoPagoForm.values };

    notify.updatePromise(
      updateTipoPago
        .mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editTipoPagoForm.resetForm();
          queryClient.invalidateQueries(["tipoPago"]);
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
    editTipoPagoForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar tipoPago */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteTipoPago
        .mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editTipoPagoForm.resetForm();
          }

          nuevoTipoPagoForm.resetForm();

          queryClient.setQueryData(["tipoPagos"], (old) =>
            old ? old.filter((u) => u.tipoPagoId !== id) : []
          );

          queryClient.invalidateQueries(["tipoPagos"]);
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
          link.setAttribute("download", "tipoPago.xlsx");

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
    tipoPagos,
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
