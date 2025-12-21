/**
 * useMonedas Hooks
 * ---------------------------------------------------------------------
 * Este archivo centraliza la lógica de consulta, creación, actualización,
 * eliminación y exportación de monedas dentro del sistema.
 *
 *  Propósito del módulo:
 * - Proveer hooks especializados que gestionen el estado remoto del catálogo
 *   de monedas mediante React Query.
 * - Garantizar sincronización automática entre UI y servidor, utilizando
 *   estrategias de caché y revalidación eficientes.
 *
 * Funcionalidades clave:
 * - useMonedas: obtiene y mantiene actualizadas las monedas.
 * - useCreateMoneda / useUpdateMoneda / useDeleteMoneda:
 *   acciones CRUD con actualización inteligente del caché.
 * - useExportarExcelMonedas:
 *   exporta la información sin modificar el estado almacenado.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMonedas,
  createMonedas,
  updateMonedas,
  deleteMonedas,
  exportarExcelMonedas,
} from "../api/Moneda";

// Consulta principal: obtiene las monedas desde el API
export const useMonedas = () => {
  return useQuery({
    queryKey: ["monedas"], // Nombre único del recurso en caché
    queryFn: getMonedas, // Función que ejecuta la obtención de datos
    staleTime: 1000 * 60 * 5, // Tiempo que los datos se consideran frescos
  });
};

// Crea una nueva moneda y sincroniza el caché tras la operación
export const useCreateMoneda = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMonedas,
    onSuccess: () => queryClient.invalidateQueries(["monedas"]),
  });
};

// Modifica una moneda existente y actualiza la caché
export const useUpdateMoneda = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMonedas,
    onSuccess: () => queryClient.invalidateQueries(["monedas"]),
  });
};

// Elimina una moneda y mantiene la UI sincronizada con el servidor
export const useDeleteMoneda = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMonedas,
    onSuccess: () => queryClient.invalidateQueries(["monedas"]),
  });
};

// Exporta la lista de monedas a Excel (no requiere invalidar caché)
export const useExportarExcelMonedas = () => {
  return useMutation({
    mutationFn: exportarExcelMonedas,
  });
};
