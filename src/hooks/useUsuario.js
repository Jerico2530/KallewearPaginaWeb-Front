/**
 * useUsuarios Hooks
 * ---------------------------------------------------------------------
 * Este archivo centraliza la gestión del catálogo de usuarios dentro del
 * sistema, permitiendo la administración y sincronización del listado con el
 * servidor mediante React Query.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables que simplifiquen el mantenimiento del
 *   inventario de usuarios.
 * - Asegurar un rendimiento óptimo mediante caché, revalidación y
 *   actualización automática tras cada operación de mantenimiento.
 *
 * Funcionalidades clave:
 * - useUsuarios: obtiene y mantiene el listado de usuarios actualizado.
 * - useCrearUsuario / useUpdateUsuario / useDeleteUsuario:
 *   operaciones CRUD con refresco inmediato del estado local.
 * - useExportarExcelUsuarios: exportación de datos sin afectar la caché.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsuarios,
  createUsuarios,
  updateUsuarios,
  deleteUsuarios,
  exportarExcelUsuarios,
} from "../api/Usuario";

// Consulta de Usuario con caché y revalidación automática
export const useUsuarios = () => {
  return useQuery({
    queryKey: ["usuarios"], // Identificador del recurso en caché
    queryFn: getUsuarios, // Consulta al API
    staleTime: 1000 * 60 * 5, // Tiempo que se consideran datos frescos
  });
};

// Creación de un nuevo Usuario
export const useCrearUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUsuarios,
    onSuccess: () => queryClient.invalidateQueries(["usuarios"]),
  });
};

// Actualización de un Usuario existente
export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUsuarios,
    onSuccess: () => queryClient.invalidateQueries(["usuarios"]),
  });
};

// Eliminación de un Usuario
export const useDeleteUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUsuarios,
    onSuccess: () => queryClient.invalidateQueries(["usuarios"]),
  });
};

// Exportación de Usuario a Excel (no modifica caché)
export const useExportarExcelUsuarios = () => {
  return useMutation({
    mutationFn: exportarExcelUsuarios,
  });
};
