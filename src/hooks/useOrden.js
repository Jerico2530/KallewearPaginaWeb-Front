/**
 * useOrdenes Hooks
 * ---------------------------------------------------------------------
 * Este archivo centraliza la lógica de consulta, creación, actualización,
 * eliminación y exportación de órdenes dentro del sistema.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables que gestionen el estado remoto de las órdenes
 *   mediante React Query, garantizando sincronización constante con el servidor.
 * - Optimizar la experiencia del usuario aplicando técnicas de caché y
 *   revalidación automática tras cambios en los datos.
 *
 * Funcionalidades clave:
 * - useOrdenes: obtiene todas las órdenes del sistema.
 * - useOrdenById: consulta una orden específica según su identificador.
 * - useCrearOrden / useActualizarOrden / useEliminarOrden:
 *   operaciones de mantenimiento que actualizan automáticamente el caché.
 * - useExportarOrdenes: genera un archivo Excel sin afectar el estado en caché.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrdenes,
  getOrdenesById,
  createOrdenes,
  updateOrdenes,
  deleteOrdenes,
  exportarExcelOrdenes,
} from "../api/Orden";

// Consulta principal: obtiene el listado completo de órdenes
export const useOrdenes = () =>
  useQuery({
    queryKey: ["ordenes"], // Identificador único del recurso en caché
    queryFn: getOrdenes, // Función que ejecuta la petición al servidor
    staleTime: 1000 * 60 * 5, // Tiempo en que los datos permanecen frescos
  });

// Obtiene los datos de una orden específica según su id
export const useOrdenById = (ordenId) =>
  useQuery({
    queryKey: ["orden", ordenId], // Cacheado por identificador individual
    queryFn: () => getOrdenesById(ordenId), // Consulta al backend por ID
    enabled: !!ordenId, // Solo ejecuta la petición si existe un ID válido
    staleTime: 1000 * 60 * 5, // Tiempo en que los datos permanecen frescos
  });

// Crea una nueva orden y sincroniza la UI tras la inserción
export const useCrearOrden = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrdenes,
    onSuccess: () => queryClient.invalidateQueries(["ordenes"]),
  });
};

// Actualiza una orden existente con revalidación automática
export const useActualizarOrden = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrdenes,
    onSuccess: () => queryClient.invalidateQueries(["ordenes"]),
  });
};

// Elimina una orden y asegura que la UI refleje el cambio
export const useEliminarOrden = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrdenes,
    onSuccess: () => queryClient.invalidateQueries(["ordenes"]),
  });
};

// Exporta la información de órdenes a Excel (no requiere revalidación de datos)
export const useExportarOrdenes = () => {
  return useMutation({
    mutationFn: exportarExcelOrdenes,
  });
};
