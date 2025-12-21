/**
 * useGeneros Hooks
 * ---------------------------------------------------------------------
 * Este módulo gestiona de manera centralizada todas las operaciones
 * relacionadas con el catálogo de "Géneros" dentro del sistema.
 *
 * Propósito del componente:
 * - Proveer hooks reutilizables para consultar, crear, actualizar,
 *   eliminar y exportar géneros utilizando React Query.
 * - Mantener el estado remoto optimizado mediante caché automática,
 *   sincronización transparente con el servidor y revalidación inteligente.
 *
 * Funcionalidades clave:
 * - useGeneros: consulta y mantiene actualizado el listado de géneros.
 * - useCrearGenero / useActualizarGenero / useEliminarGenero:
 *   administración de cambios con actualización automática del caché.
 * - useExportarExcelGeneros: exportación directa de datos a Excel
 *   sin afectar el estado almacenado en el cliente.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGeneros, createGeneros, updateGeneros, deleteGeneros,exportarExcelGeneros } from "../api/Genero";

// Consulta principal para obtener géneros desde el API
export const useGeneros = () => {
  return useQuery({
    queryKey: ["generos"], // Identificador único del recurso en caché
    queryFn: getGeneros,   // Función que realiza la solicitud al API
    staleTime: 1000 * 60 * 5, // Evita refetch innecesarios durante 5 minutos
  });
};

// Creación de género con actualización posterior de la caché
export const useCrearGenero = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGeneros,
    onSuccess: () => queryClient.invalidateQueries(["generos"]),
  });
};

// Actualización de un género existente
export const useActualizarGenero = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGeneros,
    onSuccess: () => queryClient.invalidateQueries(["generos"]),
  });
};

// Eliminación de género con sincronización automática del listado
export const useEliminarGenero = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGeneros,
    onSuccess: () => queryClient.invalidateQueries(["generos"]),
  });
};

// Exportación de la lista a Excel (no requiere revalidación)
export const useExportarExcelGeneros = () => {
  return useMutation({
    mutationFn: exportarExcelGeneros,
  });
};
