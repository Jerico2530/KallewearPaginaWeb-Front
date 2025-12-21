/**
 * usePermRoles Hooks
 * ---------------------------------------------------------------------
 * Este módulo gestiona la lógica relacionada con la asignación de permisos
 * a los roles dentro del sistema, permitiendo su consulta, mantenimiento
 * y exportación de datos.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables que administren eficientemente el estado
 *   remoto de las relaciones Permiso–Rol mediante React Query.
 * - Mantener la UI sincronizada con la base de datos a través de
 *   revalidación, caché inteligente y actualizaciones automáticas.
 *
 * Funcionalidades clave:
 * - usePermRoles: consulta y mantiene actualizada la lista de asignaciones.
 * - useCreatePermRole / useUpdatePermRole / useDeletePermRole:
 *   operaciones CRUD con invalidación del caché para reflejar cambios.
 * - useExportarExcelPermRoles: exporta los registros a Excel sin afectar
 *   el estado almacenado.
 */
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPermRoles,
  createPermRoles,
  deletePermRoles,
  updatePermRoles,
  exportarExcelPermRoles,
} from "../api/PermRol";

// Consulta principal: recupera todos los permRoles
export const usePermRoles = () => {
  return useQuery({
    queryKey: ["permRoles"], // Identificador único del recurso
    queryFn: getPermRoles, // Obtiene los datos desde el API
    staleTime: 1000 * 60 * 5, // Define un tiempo de frescura de 5 minutos
  });
};


// Creación de nueva asignación Permiso–Rol
export const useCreatePermRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPermRoles,
    onSuccess: () => queryClient.invalidateQueries(["permRoles"]),
  });
};

// Actualización de asignación existente con sincronización inmediata
export const useUpdatePermRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePermRoles,
    onSuccess: () => queryClient.invalidateQueries(["permRoles"]),
  });
};

// Eliminación de asignación 
export const useDeletePermRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePermRoles,
    onSuccess: () => queryClient.invalidateQueries(["permRoles"]),
  });
};

// Exportación de los datos a Excel
export const useExportarExcelPermRoles = () => {
  return useMutation({
    mutationFn: exportarExcelPermRoles,
  });
};
