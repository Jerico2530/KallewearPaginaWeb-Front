/**
 * useMedioPagos Hooks
 * ---------------------------------------------------------------------
 * Este archivo concentra la lógica de gestión del catálogo de medios de
 * pago dentro del sistema empresarial: lectura, mantenimiento y exportación.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables que interactúen con el API de medios de pago,
 *   manteniendo el estado remoto siempre sincronizado mediante React Query.
 * - Facilitar operaciones CRUD con actualización automática del caché.
 * - Permitir la exportación del listado a Excel sin alterar el estado local.
 *
 * Funcionalidades clave:
 * - useMedioPagos: obtiene y conserva la lista sincronizada en caché.
 * - useCrearMedioPago / useActualizarMedioPago / useEliminarMedioPago:
 *   mutaciones con revalidación automática para reflejar cambios en UI.
 * - useExportarExcelMedioPagos: genera un archivo Excel del catálogo.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {getMedioPagos,createMedioPagos,updateMedioPagos,deleteMedioPagos,exportarExcelMedioPagos} from "../api/MedioPago";

// Obtener medios de pago desde el servidor con caché optimizada
export const useMedioPagos = () => {
  return useQuery({
     queryKey: ["medioPagos"], // Identificador único del recurso
    queryFn: getMedioPagos, // Consulta al API
    staleTime: 1000 * 60 * 5, // Datos se consideran válidos por 5 minutos
  });
};

// Creación de una nueva MedioPago (actualiza la caché tras confirmación del servidor)
export const useCrearMedioPago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMedioPagos,
    onSuccess: () => queryClient.invalidateQueries(["medioPagos"]),
  });
};

// Actualizar un medio de pago existente
export const useActualizarMedioPago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMedioPagos,
    onSuccess: () => queryClient.invalidateQueries(["medioPagos"]),
  });
};

// Eliminar un medio de pago
export const useEliminarMedioPago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMedioPagos,
    onSuccess: () => queryClient.invalidateQueries(["medioPagos"]),
  });
};

// Exportar el catálogo a Excel sin afectar la caché
export const useExportarExcelMedioPagos = () => {
  return useMutation({
    mutationFn: exportarExcelMedioPagos,
  });
};
