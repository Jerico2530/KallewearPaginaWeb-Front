/**
 * useSucursales Hooks
 * ---------------------------------------------------------------------
 * Este archivo concentra la gestión completa del catálogo de sucursales:
 * consulta, creación, actualización, eliminación y exportación a Excel.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables para manipular el estado remoto de sucursales
 *   mediante React Query.
 * - Mantener la información sincronizada con el servidor usando estrategias
 *   de caché y revalidación automática.
 *
 * Funcionalidades clave:
 * - useSucursales: obtiene y mantiene actualizada la lista de sucursales.
 * - useCreateSucursal / useUpdateSucursal / useDeleteSucursal:
 *   operaciones de mantenimiento que revalidan el caché para reflejar cambios.
 * - useExportarExcelSucursales: descarga la información en un archivo Excel,
 *   sin afectar el estado almacenado.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSucursales,
  createSucursales,
  deleteSucursales,
  updateSucursales,
  exportarExcelSucursales,
} from "../api/Sucursal";

// Consulta de Sucursal con caché y revalidación automática
export const useSucursales = () => {
  return useQuery({
    queryKey: ["sucursales"], // Identificador único del recurso en caché
    queryFn: getSucursales, // Obtiene la lista desde el API
    staleTime: 1000 * 60 * 5, // Los datos se consideran válidos por 5 minutos
  });
};

// Creación de un nuevo Sucursal
export const useCreateSucursal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSucursales,
    onSuccess: () => {
      queryClient.invalidateQueries(["sucursales"]);
    },
  });
};

// Actualización de un Sucursal existente
export const useUpdateSucursal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSucursales,
    onSuccess: () => {
      queryClient.invalidateQueries(["sucursales"]);
    },
  });
};

// Eliminación de un Sucursal
export const useDeleteSucursal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSucursales,
    onSuccess: () => {
      queryClient.invalidateQueries(["sucursales"]);
    },
  });
};

// Exportación de Sucursal a Excel (no modifica caché)
export const useExportarExcelSucursales = () => {
  return useMutation({
    mutationFn: exportarExcelSucursales,
  });
};
