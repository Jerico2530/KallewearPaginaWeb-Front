/**
 * useHistorias Hooks
 * ---------------------------------------------------------------------
 * Este módulo administra la lógica de consulta, creación, actualización,
 * eliminación y exportación del catálogo de historias dentro del sistema.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables que mantengan sincronizada la información
 *   de historias con el servidor mediante React Query.
 * - Optimizar la gestión de datos mediante caché, revalidación automática
 *   y actualización del estado remoto tras operaciones CRUD.
 *
 * Funcionalidades clave:
 * - useHistorias: obtiene y mantiene las historias actualizadas.
 * - useCrearHistoria / useActualizarHistoria / useEliminarHistoria:
 *   manipulan los datos y actualizan la caché de manera automática.
 * - useExportarExcelHistorias: permite la exportación del catálogo sin
 *   modificar el estado almacenado.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHistorias, createHistorias, updateHistorias, deleteHistorias,exportarExcelHistorias } from "../api/Historia";

// Consulta del listado de historias desde el API
export const useHistorias = () => {
  return useQuery({
    queryKey: ["historias"], // Identificador del recurso en caché
    queryFn: getHistorias, // Función que obtiene los datos del servidor
    staleTime: 1000 * 60 * 5, // Tiempo durante el cual los datos se consideran válidos
  });
};

// Creación de una nueva historia (actualiza la caché tras confirmación del servidor)
export const useCrearHistoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHistorias,
    onSuccess: () => queryClient.invalidateQueries(["historias"]),
  });
};

// Actualización de una historia existente
export const useActualizarHistoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateHistorias,
    onSuccess: () => queryClient.invalidateQueries(["historias"]),
  });
};

// Eliminación de historia (sincroniza la UI con la data del servidor)
export const useEliminarHistoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHistorias,
    onSuccess: () => queryClient.invalidateQueries(["historias"]),
  });
};

// Exportación de historias a Excel (no requiere invalidar caché)
export const useExportarExcelHistorias = () => {
  return useMutation({
    mutationFn: exportarExcelHistorias,
  });
};
