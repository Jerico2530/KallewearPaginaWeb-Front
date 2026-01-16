/**
 * usePagos Hooks
 * ---------------------------------------------------------------------
 * Este archivo centraliza la lógica de consulta, creación, actualización,
 * eliminación y exportación de pagos dentro del sistema.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables para gestionar eficientemente el estado remoto
 *   de los pagos mediante React Query.
 * - Mantener sincronizada la información en UI utilizando estrategias de
 *   caché, revalidación automática y mutaciones seguras.
 *
 * Funcionalidades clave:
 * - usePagos: consulta general del listado de pagos.
 * - usePagoById: obtiene los datos detallados de un pago específico.
 * - useCreatePago / useUpdatePago / useDeletePago:
 *   acciones de mantenimiento con invalidación automática del caché.
 * - useExportarExcelPagos: permite exportar el dataset a Excel sin
 *   modificar el estado almacenado.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPagos,
  createPagos,
  updatePagos,
  deletePagos,
  getPagosById,
  exportarExcelPagos,
  getPagosUsuario
} from "../api/Pago";

// Consulta principal: recupera todos los pagos
export const usePagos = () => {
  return useQuery({
    queryKey: ["pagos"], // Identifica el recurso en caché
    queryFn: getPagos, // Solicita los datos al servidor
    staleTime: 1000 * 60 * 5, // Tiempo en que los datos se consideran frescos
  });
};

// 🔹 Pagos por usuario
export const usePagosUsuario = (usuarioId) =>
  useQuery({
    queryKey: ["pagos-usuario", usuarioId],
    queryFn: () => getPagosUsuario(usuarioId),
    enabled: !!usuarioId, 
    staleTime: 1000 * 60 * 5,
  });

// Consulta de un pago específico según su ID
export const usePagoById = (pagoId) =>
  useQuery({
    queryKey: ["pago", pagoId], // Clave única vinculada al ID
    queryFn: () => getPagosById(pagoId), // API para detalle del pago
    enabled: !!pagoId, // Evita la consulta si no existe un ID válido
    staleTime: 1000 * 60 * 5, // Tiempo en que los datos se consideran frescos
  });

// Creación de un nuevo pago (revalida el listado tras completarse)
export const useCreatePago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPagos,
    onSuccess: () => queryClient.invalidateQueries(["pagos"]),
  });
};

// Actualización de un pago existente (sincroniza la caché)
export const useUpdatePago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePagos,
    onSuccess: () => queryClient.invalidateQueries(["pagos"]),
  });
};

// Eliminación de un pago (refresca el listado en pantalla)
export const useDeletePago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePagos,
    onSuccess: () => queryClient.invalidateQueries(["pagos"]),
  });
};

// Exportación de pagos a Excel (no requiere refrescar la caché)
export const useExportarExcelPagos = () => {
  return useMutation({
    mutationFn: exportarExcelPagos,
  });
};
