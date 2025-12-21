/**
 * useDirecciones Hooks
 * ---------------------------------------------------------------------
 * Módulo encargado de gestionar la interacción con el sistema de
 * direcciones de usuario, incluyendo operaciones CRUD y exportación.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables para manejar el estado remoto asociado
 *   a direcciones con el soporte de caché y sincronización de React Query.
 * - Garantizar actualizaciones automáticas del listado tras cualquier
 *   cambio realizado por el usuario o procesos del sistema.
 *
 * Funcionalidades clave:
 * - useDirecciones: consulta y mantiene sincronizadas las direcciones.
 * - useCrearDirecciones / useActualizarDirecciones / useEliminarDirecciones:
 *   ejecutan mantenimientos y revalidan la información en caché.
 * - useExportarDirecciones: exporta los datos del módulo a Excel sin
 *   afectar el estado del frontend.
 */


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDirecciones, createDirecciones, updateDirecciones, deleteDirecciones,exportarExcelDirecciones } from "../api/Direccion";

// Obtiene todas las direcciones con políticas de caché por 5 minutos
export const useDirecciones = () => {
  return useQuery({
    queryKey: ["direciones"],// Identifica la caché de direcciones
    queryFn: getDirecciones, // Solicita los datos al API
    staleTime: 1000 * 60 * 5,// Tiempo durante el cual los datos son frescos
  });
};

// Creación de nueva dirección con actualización automática del caché
export const useCrearDirecciones = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDirecciones,
    onSuccess: () => queryClient.invalidateQueries(["direciones"]),
  });
};


// Actualización de una dirección existente
export const useActualizarDirecciones = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDirecciones,
    onSuccess: () => queryClient.invalidateQueries(["direciones"]),
  });
};

// Eliminación de una dirección del sistema
export const useEliminarDirecciones = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDirecciones,
    onSuccess: () => queryClient.invalidateQueries(["direciones"]),
  });
};

// Exportación de direcciones a Excel (no requiere revalidar la caché)
export const useExportarDirecciones = () => {
  return useMutation({
    mutationFn: exportarExcelDirecciones,
  });
};

