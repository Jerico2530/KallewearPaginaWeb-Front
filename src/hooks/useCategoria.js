/**
 * useCategorias Hooks
 * ---------------------------------------------------------------------
 * Este archivo centraliza la lógica de consulta, creación, actualización,
 * eliminación y exportación de categorías dentro del sistema.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables que gestionen eficientemente el estado
 *   remoto del catálogo de categorías mediante React Query.
 * - Optimizar el rendimiento a través de estrategias automáticas
 *   de caché, revalidación y sincronización con el servidor.
 *
 * Funcionalidades clave:
 * - useCategorias: obtiene y mantiene las categorías sincronizadas.
 * - useCrearCategoria / useActualizarCategoria / useEliminarCategoria:
 *   acciones de mantenimiento con actualización automática del caché.
 * - useExportarExcelCategorias: exporta la información a un archivo Excel,
 *   sin afectar el estado almacenado.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategorias,
  createCategorias,
  updateCategorias,
  deleteCategorias,
  exportarExcelCategorias,
} from "../api/Categoria";

// Obtener categorías
export const useCategorias = () => {
  return useQuery({
    queryKey: ["categorias"], // Identificador único del recurso en caché
    queryFn: getCategorias, // Obtiene los datos del API
    staleTime: 1000 * 60 * 5, // Define cuánto tiempo se consideran frescos
  });
};

// Creación de nueva categoría (actualiza la caché automáticamente)
export const useCrearCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategorias,
    onSuccess: () => {
      queryClient.invalidateQueries(["categorias"]);
    },
  });
};

// Actualización de categoría existente
export const useActualizarCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategorias,
    onSuccess: () => {
      queryClient.invalidateQueries(["categorias"]);
    },
  });
};

// Eliminación de categoría (sincroniza UI tras confirmación del servidor)
export const useEliminarCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategorias,
    onSuccess: () => {
      queryClient.invalidateQueries(["categorias"]);
    },
  });
};

// Exportación de la lista a Excel (no requiere revalidación)
export const useExportarExcelCategorias = () => {
  return useMutation({
    mutationFn: exportarExcelCategorias,
  });
};
