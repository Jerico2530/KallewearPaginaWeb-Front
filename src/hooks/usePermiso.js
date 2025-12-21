/**
 * usePermisos Hooks
 * ---------------------------------------------------------------------
 * Este módulo gestiona la lógica asociada a los permisos del sistema,
 * incluyendo su consulta, mantenimiento y exportación.
 *
 * Propósito del módulo:
 * - Proporcionar hooks reutilizables para administrar el estado remoto
 *   de los permisos mediante React Query.
 * - Mantener la UI sincronizada con la base de datos mediante estrategias
 *   de caché, revalidación y actualizaciones automáticas.
 *
 * Funcionalidades clave:
 * - usePermisos: consulta y mantiene actualizada la lista de permisos.
 * - useCrearPermiso / useUpdatePermiso / useDeletePermiso:
 *   operaciones de mantenimiento con invalidación automática del caché.
 * - useExportarExcelPermisos: exporta la información a Excel sin alterar
 *   el estado almacenado.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPermisos,
  createPermisos,
  updatePermisos,
  deletePermisos,
  exportarExcelPermisos,
} from "../api/Permiso";

// Consulta principal: recupera todos los permiso
export const usePermisos = () =>
  useQuery({
    queryKey: ["permisos"], // Identificador único del recurso en caché
    queryFn: getPermisos, // Obtiene permisos desde el API
    staleTime: 1000 * 60 * 5, // Datos frescos por 5 minutos
  });

// Creación de nuevo permiso (forza revalidación del listado)
export const useCrearPermiso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPermisos,
    onSuccess: () => queryClient.invalidateQueries(["permisos"]),
  });
};

// Actualización de permiso existente
export const useUpdatePermiso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePermisos,
    onSuccess: () => queryClient.invalidateQueries(["permisos"]),
  });
};

// Eliminación de permiso (sincroniza la UI tras confirmación del servidor)
export const useDeletePermiso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePermisos,
    onSuccess: () => queryClient.invalidateQueries(["permisos"]),
  });
};

// Exportación del listado de permisos a Excel (sin refrescar la UI)
export const useExportarExcelPermisos = () => {
  return useMutation({
    mutationFn: exportarExcelPermisos,
  });
};
