/**
 * Lógica para la administración de Carrito de Compras.
 * ------------------------------------------------------------------
 * Propósito:
 *  - Centralizar el flujo completo de gestión del carrito desde el panel
 *    administrativo utilizando React Query.
 *  - Mantener los componentes UI limpios separando la lógica de negocio.
 *  - Validar formularios y gestionar notificaciones profesionales.
 *
 * Funcionalidades clave:
 *  - Consultar y mantener sincronizado el listado de Carritos de Compra.
 *  - Crear, modificar y eliminar elementos, actualizando correctamente la UI.
 *  - Controlar el estado de edición para una experiencia más intuitiva.
 *  - Manejo correcto de errores provenientes del servidor.
 */

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCarritoCompras,
  useCrearCarritoCompras,
  useActualizarCarritoCompras,
  useEliminarCarritoCompras,
} from "../../../../hooks/useCarrito";
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useCarritoComprasAdmin = (
  nuevoCarritoCompraForm,
  editCarritoCompraForm
) => {
  // ID del carrito actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Servicio centralizado de notificaciones UI
  const notify = useNotification();
  // Consulta principal de datos del carrito (caché integrada)
  const { data: carritoCompras = [], isLoading } = useCarritoCompras();
  // Mutaciones CRUD
  const crearCarritoCompra = useCrearCarritoCompras();
  const updateCarritoCompra = useActualizarCarritoCompras();
  const deleteCarritoCompra = useEliminarCarritoCompras();

  /** Crear un nuevo registro en Carrito de Compra */
  const handleCrear = async () => {
    // Evita enviar datos inválidos
    if (!(await nuevoCarritoCompraForm.validate())) {
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearCarritoCompra.mutate(nuevoCarritoCompraForm.values, {
      onSuccess: () => {
        notify.success("CarritoCompra creado correctamente");
        queryClient.invalidateQueries(["carritoCompras"]); // sincroniza la vista
        nuevoCarritoCompraForm.resetForm(); // limpia campos
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (carritoCompra) => {
    setEditandoId(carritoCompra.carritoId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editCarritoCompraForm.setValues({
      usuarioId: carritoCompra.usuarioId || "",
      productoTallaId: carritoCompra.productoTallaId || "",
      cantidad: carritoCompra.cantidad || "",
      precioUnitario: carritoCompra.precioUnitario || "",
      estado: carritoCompra.estado ?? true,
    });
  };

  /** Guardar cambios de edición */
  const handleGuardar = async () => {
    if (!(await editCarritoCompraForm.validate())) {
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }

    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = {
      carritoId: editandoId,
      ...editCarritoCompraForm.values,
    };

    updateCarritoCompra.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("CarritoCompra actualizado correctamente");
        setEditandoId(null);
        editCarritoCompraForm.resetForm();
        queryClient.invalidateQueries(["carritoCompras"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editCarritoCompraForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar un carrito con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este CarritoCompra?"
    );
    if (!confirmar) return;

    deleteCarritoCompra.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("CarritoCompra eliminado correctamente");
          // Si el elemento eliminado estaba en edición, salir del modo edición
          if (editandoId === id) {
            setEditandoId(null);
            editCarritoCompraForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoCarritoCompraForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["carritoCompras"], (old) =>
            old ? old.filter((c) => c.carritoId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["carritoCompras"]);
        }
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  return {
    carritoCompras,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
  };
};
