/**
 * useCarrito Hooks 
 *
 * Archivo destinado a centralizar la lógica de obtención, creación,
 * actualización, eliminación y exportación de anuncios en el sistema.
 *
 * Funcionalidades clave:
 * - Consulta del carrito y su total
 * - Creación, modificación y eliminación de productos
 * - Vaciar carrito de forma inmediata
 * - Confirmar la compra y actualizar datos en caché
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCarritoCompras,
  ObtenerTodosLosCarritoCompraUsuarioAsync,
  createCarritoCompras,
  updateCarritoCompras,
  deleteCarritoCompras,
  vaciarCarritoCompras,
  getTotalCarritoCompras,
  patchCarritoCompras,
  confirmarCompraCarrito,
} from "../api/Carrito";

// Consulta de anuncios con caché y revalidación automática
export const useCarritoCompras = () =>
  useQuery({
    queryKey: ["carritoCompra"], // Identificador único de la caché
    queryFn: getCarritoCompras, // Función que obtiene los datos desde el API
    staleTime: 0, // Los datos se consideran frescos por 0 minutos
  });

// Obtiene los productos y total del carrito de un usuario específico
export const useCarritoComprasUsuario = (usuarioId) =>
  useQuery({
    queryKey: ["carritoCompra", usuarioId],
    queryFn: () => ObtenerTodosLosCarritoCompraUsuarioAsync(usuarioId),
    enabled: !!usuarioId,
    staleTime: 0,
  });

// Creación de un nuevo carrito
export const useCrearCarritoCompras = (usuarioId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCarritoCompras,
    onSuccess: () =>
      queryClient.invalidateQueries(["carritoCompra", usuarioId]),
  });
};

// Actualización de un carrito existente
export const useActualizarCarritoCompras = (usuarioId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCarritoCompras,
    onSuccess: () =>
      queryClient.invalidateQueries(["carritoCompra", usuarioId]),
  });
};

// Eliminación de un carrito
export const useEliminarCarritoCompras = (usuarioId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCarritoCompras,
    onSuccess: (_, carritoId) => {
      // 🔹 Optimistic update: borrar del cache sin recargar todo
      queryClient.setQueryData(["carritoCompra", usuarioId], (old) => {
        if (!old) return { items: [], totalCarrito: 0 };
        return {
          ...old,
          items: old.items.filter((item) => item.carritoId !== carritoId),
          totalCarrito: old.items
            .filter((item) => item.carritoId !== carritoId)
            .reduce((sum, i) => sum + i.cantidad * i.precio, 0),
        };
      });
    },
  });
};

//  Vacía por completo el carrito del usuario en caché tras confirmación de API
export const useVaciarCarritoCompras = (usuarioId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vaciarCarritoCompras,
    onSuccess: () => {
      // 🔹 Vaciar inmediatamente el cache
      queryClient.setQueryData(["carritoCompra", usuarioId], {
        items: [],
        totalCarrito: 0,
      });
    },
  });
};

//  Consulta exclusivamente el total del carrito del usuario
export const useTotalCarritoCompras = (usuarioId) =>
  useQuery({
    queryKey: ["total", usuarioId],
    queryFn: () => getTotalCarritoCompras(usuarioId),
    enabled: !!usuarioId,
  });

// Modificaciones parciales (PATCH) de uno o varios productos
export const usePatchCarritoCompras = (usuarioId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ carritoId, operaciones }) =>
      patchCarritoCompras(carritoId, operaciones),
    onSuccess: () =>
      queryClient.invalidateQueries(["carritoCompra", usuarioId]),
  });
};

// Confirmar compra: vacía carrito y refresca estado visual
export const useConfirmarCompraCarrito = (usuarioId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => confirmarCompraCarrito(usuarioId),
    onSuccess: (data) => {
      // 🔹 Refrescar carrito y total automáticamente
      queryClient.invalidateQueries(["carritoCompra", usuarioId]);
      queryClient.invalidateQueries(["total", usuarioId]);
    },
  });
};
