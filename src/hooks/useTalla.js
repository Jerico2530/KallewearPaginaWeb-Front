/**
 * useTallas Hooks
 * ---------------------------------------------------------------------
 * Este archivo gestiona el mantenimiento completo del catálogo de tallas:
 * consulta, creación, actualización, eliminación y exportación de datos.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables que administren eficientemente el estado
 *   remoto de tallas mediante React Query.
 * - Garantizar sincronización automática con el servidor mediante caché
 *   y revalidación inteligente.
 *
 * Funcionalidades clave:
 * - useTallas: obtiene y mantiene sincronizada la lista de tallas.
 * - useCreateTalla / useUpdateTalla / useDeleteTalla:
 *   acciones de mantenimiento con actualización inmediata del estado.
 * - useExportarExcelTallas: genera un archivo Excel sin alterar el caché.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTallas, createTallas, deleteTallas, updateTallas,exportarExcelTallas } from "../api/Talla";

// Consulta de Talla con caché y revalidación automática
export const useTallas = () => {
  return useQuery({
    queryKey: ["tallas"], // Identificador único del recurso en caché
    queryFn: getTallas, // Solicita la información desde el API
    staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
  });
};

// Creación de un nuevo Talla
export const useCreateTalla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTallas,
    onSuccess: () => {
      queryClient.invalidateQueries(["tallas"]);
    },
  });
};

// Actualización de un Talla existente
export const useUpdateTalla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTallas,
    onSuccess: () => {
      queryClient.invalidateQueries(["tallas"]);
    },
  });
};

// Eliminación de un Talla
export const useDeleteTalla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTallas,
    onSuccess: () => {
      queryClient.invalidateQueries(["tallas"]);
    },
  });
};

// Exportación de Talla a Excel (no modifica caché)
export const useExportarExcelTallas = () => {
  return useMutation({
    mutationFn: exportarExcelTallas,
  });
};