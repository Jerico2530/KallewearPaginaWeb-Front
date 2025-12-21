/**
 * useTipoPagos Hooks
 * ---------------------------------------------------------------------
 * Este archivo centraliza la gestión del catálogo de Tipos de Pago:
 * consulta, creación, actualización, eliminación y exportación.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables para administrar el estado remoto de
 *   los tipos de pago mediante React Query.
 * - Optimizar el rendimiento mediante caché, revalidación automática
 *   y sincronización eficiente con el servidor.
 *
 * Funcionalidades clave:
 * - useTipoPagos: obtiene y mantiene sincronizados los tipos de pago.
 * - useCrearTipoPagoso / useActualizarTipoPagos / useEliminarTipoPagos:
 *   mantienen el catálogo actualizado en tiempo real.
 * - useExportarExcelTipoPagos: genera un archivo Excel sin modificar el estado.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTipoPagos,
  createTipoPagos,
  updateTipoPagos,
  deleteTipoPagos,
  exportarExcelTipoPagos,
} from "../api/TipoPago";

// Consulta de TipoPago con caché y revalidación automática
export const useTipoPagos = () => {
  return useQuery({
    queryKey: ["tipoPagos"], // Identificador único del recurso
    queryFn: getTipoPagos, // Solicita los datos al servidor
    staleTime: 1000 * 60 * 5, // Mantiene los datos frescos por 5 minutos
  });
};

// Creación de un nuevo TipoPago
export const useCrearTipoPagoso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTipoPagos,
    onSuccess: () => queryClient.invalidateQueries(["tipoPagos"]),
  });
};

// Actualización de un TipoPago existente
export const useActualizarTipoPagos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTipoPagos,
    onSuccess: () => queryClient.invalidateQueries(["tipoPagos"]),
  });
};

// Eliminación de un TipoPago
export const useEliminarTipoPagos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTipoPagos,
    onSuccess: () => queryClient.invalidateQueries(["tipoPagos"]),
  });
};

// Exportación de TipoPago a Excel (no modifica caché)
export const useExportarExcelTipoPagos = () => {
  return useMutation({
    mutationFn: exportarExcelTipoPagos,
  });
};
