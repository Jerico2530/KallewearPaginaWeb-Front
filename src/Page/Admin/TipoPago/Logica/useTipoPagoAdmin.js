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
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useTipoPagosAdmin = (nuevoTipoPagoForm, editTipoPagoForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelTipoPagos();
  // Servicio global de notificaciones
  const notify = useNotification();
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
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearTipoPago.mutate(nuevoTipoPagoForm.values, {
      onSuccess: () => {
        notify.success("TipoPago creado correctamente");
        queryClient.invalidateQueries(["tipoPago"]); // sincroniza lista
        nuevoTipoPagoForm.resetForm(); // limpia formulario
      },
      onError: (error) => handleApiError(error, notify),
    });
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
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { tipoPagoId: editandoId, ...editTipoPagoForm.values };

    updateTipoPago.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("TipoPago actualizado correctamente");
        setEditandoId(null);
        editTipoPagoForm.resetForm();
        queryClient.invalidateQueries(["tipoPago"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar modo edición sin guardar cambios */
  const handleCancelar = () => {
    setEditandoId(null);
    editTipoPagoForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar tipoPago */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este tipoPago?"
    );
    if (!confirmar) return;

    deleteTipoPago.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("TipoPago eliminado correctamente");

          // Si el anuncio eliminado estaba siendo editado, reiniciar estado
          if (editandoId === id) {
            setEditandoId(null);
            editTipoPagoForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoTipoPagoForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["tipoPagos"], (old) =>
            old ? old.filter((c) => c.tipoPagoId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["tipoPagos"]);
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
      link.setAttribute("download", "tipoPago.xlsx"); // nombre del archivo

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
