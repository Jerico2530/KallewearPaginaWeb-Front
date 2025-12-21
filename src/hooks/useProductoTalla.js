/**
 * useProductoTallas Hooks
 * ---------------------------------------------------------------------
 * Este módulo administra la relación entre productos y tallas dentro del
 * sistema, proporcionando mecanismos para consultar, gestionar y exportar
 * la información asociada.
 *
 * Propósito del módulo:
 * - Ofrecer hooks reutilizables que manejen eficientemente el estado remoto
 *   de Producto–Talla mediante React Query.
 * - Optimizar el rendimiento con estrategias automáticas de caché,
 *   sincronización y revalidación del servidor.
 *
 * Funcionalidades clave:
 * - useProductoTallas: mantiene sincronizadas las asignaciones registradas.
 * - useProductoTallaById: consulta específica para detalles por identificación.
 * - useCreateProductoTalla / useUpdateProductoTalla / useDeleteProductoTalla:
 *   acciones de actualización con refresco automático de la UI.
 * - useExportarExcelProductoTallas: exporta los datos a Excel sin alterar
 *   el estado administrado en caché.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductoTallas,
  createProductoTallas,
  deleteProductoTallas,
  updateProductoTallas,
  exportarExcelProductoTallas,
  getProductoTallasById,
} from "../api/ProductoTalla";

// Consulta de producto-Talla con caché y revalidación automática
export const useProductoTallas = () => {
  return useQuery({
    queryKey: ["productoTallas"], // Identificador único en caché
    queryFn: getProductoTallas, // Consulta al backend
    staleTime: 1000 * 60 * 5, // Datos válidos durante 5 minutos
  });
};
// Consulta detallada por ID (solo se ejecuta cuando se proporciona un valor)
export const useProductoTallaById = (productoTallaId) => {
  return useQuery({
    queryKey: ["productoTalla", productoTallaId],
    queryFn: async () => {
      const data = await getProductoTallasById(productoTallaId);
      return data || null; // Devuelve null si no hay resultado
    },
    enabled: !!productoTallaId, // solo se ejecuta si hay ID
    staleTime: 1000 * 60 * 5,
  });
};

 // Creación de un nuevo producto-Talla
export const useCreateProductoTalla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProductoTallas,
    onSuccess: () => {
      queryClient.invalidateQueries(["productoTallas"]);
    },
  });
};

// Actualización de un producto-Talla existente
export const useUpdateProductoTalla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProductoTallas,
    onSuccess: () => {
      queryClient.invalidateQueries(["productoTallas"]);
    },
  });
};

// Eliminación de un producto-Talla
export const useDeleteProductoTalla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProductoTallas,
    onSuccess: () => {
      queryClient.invalidateQueries(["productoTallas"]);
    },
  });
};

// Exportación de producto-Talla a Excel (no modifica caché)
export const useExportarExcelProductoTallas = () => {
  return useMutation({
    mutationFn: exportarExcelProductoTallas,
  });
};
