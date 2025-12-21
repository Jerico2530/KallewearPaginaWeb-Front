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
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useMedioPagosAdmin = (nuevoMedioPagoForm, editMedioPagoForm) => {
  // ID del carrito actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelMedioPagos();
  // Servicio centralizado de notificaciones UI
  const notify = useNotification();
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
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearMedioPago.mutate(nuevoMedioPagoForm.values, {
      onSuccess: () => {
        notify.success("MedioPago creado correctamente");
        queryClient.invalidateQueries(["medioPago"]);
        nuevoMedioPagoForm.resetForm();
      },
      onError: (error) => handleApiError(error, notify),
    });
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
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { medioPagoId: editandoId, ...editMedioPagoForm.values };

    updateMedioPago.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("MedioPago actualizado correctamente");
        setEditandoId(null);
        editMedioPagoForm.resetForm();
        queryClient.invalidateQueries(["medioPago"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editMedioPagoForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar un carrito con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este medioPago?"
    );
    if (!confirmar) return;

    deleteMedioPago.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("MedioPago eliminado correctamente");

          // Si el elemento eliminado estaba en edición, salir del modo edición
          if (editandoId === id) {
            setEditandoId(null);
            editMedioPagoForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoMedioPagoForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["medioPagos"], (old) =>
            old ? old.filter((c) => c.medioPagoId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["medioPagos"]);
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
      link.setAttribute("download", "medioPago.xlsx"); // nombre del archivo

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
