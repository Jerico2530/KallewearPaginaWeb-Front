/**
 * useRoles Hooks
 * ---------------------------------------------------------------------
 * Este archivo centraliza la lógica de consulta, creación, actualización,
 * eliminación y exportación de roles dentro del sistema.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables que gestionen el estado remoto del catálogo
 *   de roles mediante React Query.
 * - Mantener la información siempre sincronizada con el servidor y evitar
 *   solicitudes innecesarias mediante mecanismos de caché.
 *
 * Funcionalidades clave:
 * - useRoles: obtiene y mantiene los roles actualizados.
 * - useCreateRol / useUpdateRol / useDeleteRol:
 *   gestiona operaciones de mantenimiento con actualización automática del caché.
 * - useExportarExcelRoles: exporta los datos a un archivo Excel
 *   sin intervenir en el estado almacenado.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoles,
  createRoles,
  updateRoles,
  deleteRoles,
  exportarExcelRoles,
} from "../api/Rol";

// Consulta de userRol con caché y revalidación automática
export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"], // Identificador único para almacenamiento en caché
    queryFn: getRoles, // Obtiene la lista desde el servidor
    staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minuto
  });
};

// Creación de un nuevo userRol
export const useCreateRol = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoles,
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
    },
  });
};

// Actualización de un userRol existente
export const useUpdateRol = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRoles,
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
    },
  });
};

// Eliminación de un userRol
export const useDeleteRol = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoles,
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
    },
  });
};

// Exportación de userRol a Excel (no modifica caché)
export const useExportarExcelRoles = () => {
  return useMutation({
    mutationFn: exportarExcelRoles,
  });
};
