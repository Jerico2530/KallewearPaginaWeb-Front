/**
 * useProductos Hooks
 * ---------------------------------------------------------------------
 * Este archivo centraliza la gestión del catálogo de productos dentro del sistema:
 * consulta, creación, actualización, eliminación y exportación de información.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables para interactuar con el backend empleando React Query.
 * - Optimizar el rendimiento mediante caché, sincronización automática y reducción
 *   de solicitudes innecesarias al servidor.
 *
 * Funcionalidades clave:
 * - useProductos: mantiene la lista de productos sincronizada con el servidor.
 * - useCrearProducto / useUpdateProducto / useDeleteProducto:
 *   hooks orientados al mantenimiento con actualización automática del caché.
 * - useExportarExcelProductos: genera un archivo Excel de forma controlada,
 *   sin modificar el estado almacenado.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductos,
  createProducto,
  deleteProducto,
  updateProducto,
  exportarExcelProducto,
} from "../api/Producto";

// Consulta de producto con caché y revalidación automática
export const useProductos = () =>
  useQuery({
    queryKey: ["productos"], // Clave única para el manejo en caché
    queryFn: getProductos, // Función encargada de obtener los datos desde el API
    staleTime: 1000 * 60 * 5, // Tiempo en el que los datos son considerados frescos
  });

// Creación de un nuevo producto
export const useCrearProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProducto,
    onSuccess: () => queryClient.invalidateQueries(["productos"]),
  });
};

// Actualización de un productos existente
export const useUpdateProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProducto,
    onSuccess: () => queryClient.invalidateQueries(["productos"]),
  });
};


// Eliminación de un productos
export const useDeleteProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => queryClient.invalidateQueries(["productos"]),
  });
};

// Exportación de productos a Excel (no modifica caché)
export const useExportarExcelProductos = () => {
  return useMutation({
    mutationFn: exportarExcelProducto,
  });
};
