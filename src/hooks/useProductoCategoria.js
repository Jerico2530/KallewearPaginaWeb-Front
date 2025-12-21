/**
 * useProductoCategorias Hooks
 * ---------------------------------------------------------------------
 * Este módulo gestiona la relación entre productos y categorías dentro del
 * sistema, permitiendo consultar, crear, actualizar, eliminar y exportar
 * datos asociados.
 *
 * Propósito del módulo:
 * - Ofrecer hooks reutilizables para operaciones CRUD sobre relaciones
 *   Producto–Categoría, manteniendo la sincronización automática del estado.
 * - Integrar mecanismos de rendimiento de React Query como caché y
 *   revalidación, evitando solicitudes innecesarias al servidor.
 *
 * Funcionalidades clave:
 * - useProductoCategorias: obtiene y actualiza el catálogo de asignaciones.
 * - useCreateProductoCategoria / useUpdateProductoCategoria /
 *   useDeleteProductoCategoria: operaciones de mantenimiento con refresco
 *   automático de la UI.
 * - useExportarExcelProductoCategorias: exporta la información a Excel
 *   sin afectar el estado gestionado en caché.
 */

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductoCategorias ,  updateProductoCategorias ,deleteProductoCategorias,createProductoCategorias,exportarExcelProductoCategorias} from "../api/ProductoCategoria";
import useUserStore from "../store/userStore";

// Consulta de producto-Categoria con caché y revalidación automática
export const useProductoCategorias = () => {
  return useQuery({
    queryKey: ["productoCategorias"], // Identificador único del listado en caché
    queryFn: getProductoCategorias, // Obtiene los datos desde el servidor
    staleTime: 1000 * 60 * 5, // Mantiene los datos como válidos durante 5 minutos
  });
};

// Creación de un nuevo producto-Categoria
export const useCreateProductoCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProductoCategorias,
    onSuccess: () => queryClient.invalidateQueries(["productoCategorias"]),
  });
};

// Actualización de un producto-Categoria existente
export const useUpdateProductoCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProductoCategorias,
    onSuccess: () => queryClient.invalidateQueries(["productoCategorias"]),
  });
};

// Eliminación de un producto-Categoria
export const useDeleteProductoCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProductoCategorias,
    onSuccess: () => queryClient.invalidateQueries(["productoCategorias"]),
  });
};

// Exportación de producto-Categoria a Excel (no modifica caché)
export const useExportarExcelProductoCategorias = () => {
  return useMutation({
    mutationFn: exportarExcelProductoCategorias,
  });
};