/**
 * Lógica para la administración de Detalles de Órdenes.
 * ------------------------------------------------------------------
 * Propósito:
 *  - Centralizar el flujo completo de gestión de detalles de órdenes desde el panel
 *    administrativo utilizando React Query.
 *  - Mantener los componentes UI limpios separando la lógica de negocio.
 *  - Validar formularios y gestionar notificaciones profesionales.
 *
 * Funcionalidades clave:
 *  - Consultar y mantener sincronizado el listado de detalles de órdenes.
 *  - Crear, modificar y eliminar elementos, actualizando correctamente la UI.
 *  - Controlar el estado de edición para una experiencia más intuitiva.
 *  - Manejo correcto de errores provenientes del servidor.
 */

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useOrdenDetalles,
  useCrearOrdenDetalles,
  useActualizarOrdenDetalles,
  useEliminarOrdenDetalles,
} from "../../../../hooks/useOrdenDetalle";
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useOrdenDetallesAdmin = (
  nuevoOrdenDetalleForm,
  editOrdenDetalleForm
) => {
  // ID del oredenDetalle actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Servicio centralizado de notificaciones UI
  const notify = useNotification();
  // Consulta principal de datos del oredenDetalle (caché integrada)
  const { data: ordenDetalles, isLoading } = useOrdenDetalles();
  // Mutaciones CRUD
  const crearOrdenDetalle = useCrearOrdenDetalles();
  const updateOrdenDetalle = useActualizarOrdenDetalles();
  const deleteOrdenDetalle = useEliminarOrdenDetalles();

  /** Crear un nuevo registro en Carrito de Compra */
  const handleCrear = async () => {
    // Evita enviar datos inválidos
    if (!(await nuevoOrdenDetalleForm.validate())) {
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearOrdenDetalle.mutate(nuevoOrdenDetalleForm.values, {
      onSuccess: () => {
        notify.success("OrdenDetalle creado correctamente");
        queryClient.invalidateQueries(["ordenDetalle"]); // sincroniza la vista
        nuevoOrdenDetalleForm.resetForm(); // limpia campos
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (ordenDetalle) => {
    setEditandoId(ordenDetalle.ordenDetalleId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editOrdenDetalleForm.setValues({
      ordenId: ordenDetalle.ordenId || "",
      usuarioId: ordenDetalle.usuarioId || "",
      prodcutoId: ordenDetalle.productoId || "",
      cantidad: ordenDetalle.cantidad || "",
      recioUnitario: ordenDetalle.recioUnitario || "",
      estado: ordenDetalle.estado ?? true,
    });
  };

  /** Guardar cambios de edición */
  const handleGuardar = async () => {
    if (!(await editOrdenDetalleForm.validate())) {
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = {
      ordenDetalleId: editandoId,
      ...editOrdenDetalleForm.values,
    };

    updateOrdenDetalle.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("OrdenDetalle actualizado correctamente");
        setEditandoId(null);
        editOrdenDetalleForm.resetForm();
        queryClient.invalidateQueries(["ordenDetalle"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editOrdenDetalleForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar un oredenDetalle con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este ordenDetalle?"
    );
    if (!confirmar) return;

    deleteOrdenDetalle.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("OrdenDetalle eliminado correctamente");

          // Si el elemento eliminado estaba en edición, salir del modo edición
          if (editandoId === id) {
            setEditandoId(null);
            editOrdenDetalleForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoOrdenDetalleForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["ordenDetalles"], (old) =>
            old ? old.filter((c) => c.ordenDetalleId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["ordenDetalles"]);
        }
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  return {
    ordenDetalles,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
  };
};
