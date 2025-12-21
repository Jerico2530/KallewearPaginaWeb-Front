/**
 * useOrdenDetalles Hooks
 * ---------------------------------------------------------------------
 * Este archivo agrupa la lógica de consulta, creación, actualización
 * y eliminación de los detalles de una orden dentro del sistema.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables para gestionar el estado remoto de los
 *   detalles de órdenes mediante React Query.
 * - Garantizar la sincronización automática con el servidor y mantener
 *   la UI actualizada frente a cambios realizados por el usuario.
 *
 * Funcionalidades clave:
 * - useOrdenDetalles: obtiene todos los detalles registrados.
 * - useOrdenDetallesById: consulta un detalle específico mediante su ID.
 * - useCrearOrdenDetalles / useActualizarOrdenDetalles / useEliminarOrdenDetalles:
 *   operaciones CRUD con revalidación automática del caché.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrdenDetalles,
  getOrdenDetallesById,
  createOrdenDetalles,
  updateOrdenDetalles,
  deleteOrdenDetalles,
} from "../api/OrdenDetalle";

// Consulta principal: recupera todos los detalles de órdenes
export const useOrdenDetalles = () =>
  useQuery({
    queryKey: ["ordenDetalles"], // Identificador único para la caché
    queryFn: getOrdenDetalles, // Llamada al backend
    staleTime: 1000 * 60 * 5, // Los datos se consideran frescos durante 5 min
  });

// Consulta individual: obtiene detalles específicos según su ID
export const useOrdenDetallesById = (ordenDetallesId) =>
  useQuery({
    queryKey: ["ordenDetalles", ordenDetallesId], // Cacheado por cada ID
    queryFn: () => getOrdenDetallesById(ordenDetallesId),
    enabled: !!ordenDetallesId, // Evita ejecutar la petición sin ID válido
    staleTime: 1000 * 60 * 5, // Los datos se consideran frescos durante 5 min
  });

// Crea un nuevo detalle y sincroniza automáticamente el listado
export const useCrearOrdenDetalles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrdenDetalles,
    onSuccess: () => queryClient.invalidateQueries(["ordenDetalles"]),
  });
};

// Actualiza un detalle existente y revalida la información almacenada
export const useActualizarOrdenDetalles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrdenDetalles,
    onSuccess: () => queryClient.invalidateQueries(["ordenDetalles"]),
  });
};

// Elimina un detalle de orden y actualiza la UI tras confirmación
export const useEliminarOrdenDetalles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrdenDetalles,
    onSuccess: () => queryClient.invalidateQueries(["ordenDetalles"]),
  });
};
