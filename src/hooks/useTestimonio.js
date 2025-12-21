/**
 * useTestimonios Hooks
 * ---------------------------------------------------------------------
 * Este archivo centraliza la gestión del catálogo de testimonios del sistema:
 * consulta, creación, edición, eliminación y exportación de contenido.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables para administrar el estado remoto de
 *   testimonios mediante React Query.
 * - Mantener sincronizada la información entre la UI y el servidor
 *   mediante estrategias automáticas de caché y revalidación.
 *
 * Funcionalidades clave:
 * - useTestimonios: obtiene y mantiene actualizada la lista de testimonios.
 * - useCrearTestimonio / useActualizarTestimonio / useEliminarTestimonio:
 *   operaciones de mantenimiento con actualización inmediata del caché.
 * - useExportarExcelTestimonios: genera un archivo Excel sin alterar el estado.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTestimonios,
  createTestimonios,
  updateTestimonios,
  deleteTestimonios,
  exportarExcelTestimonios,
} from "../api/Testimonio";

// Consulta de Testimonio con caché y revalidación automática
export const useTestimonios = () => {
  return useQuery({
    queryKey: ["testimonios"], // Clave única del recurso en caché
    queryFn: getTestimonios, // Solicita datos del API
    staleTime: 1000 * 60 * 5, // Los datos permanecen frescos por 5 minutos
  });
};

// Creación de un nuevo Testimonio
export const useCrearTestimonio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTestimonios,
    onSuccess: () => queryClient.invalidateQueries(["testimonios"]),
  });
};

// Actualización de un Testimonio existente
export const useActualizarTestimonio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTestimonios,
    onSuccess: () => queryClient.invalidateQueries(["testimonios"]),
  });
};

// Eliminación de un Testimonio
export const useEliminarTestimonio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTestimonios,
    onSuccess: () => queryClient.invalidateQueries(["testimonios"]),
  });
};

// Exportación de Testimonio a Excel (no modifica caché)
export const useExportarExcelTestimonios = () => {
  return useMutation({
    mutationFn: exportarExcelTestimonios,
  });
};
