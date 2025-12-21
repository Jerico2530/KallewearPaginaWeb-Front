/**
 * useAnuncios Hooks 
 * ---------------------------------------------------------------------
 * Archivo destinado a centralizar la lógica de obtención, creación,
 * actualización, eliminación y exportación de anuncios en el sistema.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables y tipados para interactuar con el API
 *   de anuncios desde cualquier parte del proyecto.
 * - Optimizar el rendimiento mediante caché, revalidación y estrategias
 *   de actualización automáticas proporcionadas por React Query.
 *
 * Funcionalidades clave:
 * - useAnuncios: consulta y mantiene los anuncios sincronizados en caché.
 * - useCrearAnuncio / useUpdateAnuncio / useDeleteAnuncio:
 *   mutaciones que invalidan datos automáticamente tras un cambio.
 * - useExportarExcelAnuncios: permite exportar los datos a archivo Excel
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {getAnuncios,createAnuncios ,updateAnuncios,deleteAnuncios,exportarExcelAnuncios} from "../api/Anuncio";

// Consulta de anuncios con caché y revalidación automática
export const useAnuncios = () =>
  useQuery({
    queryKey:["anuncios"], // Identificador único de la caché
    queryFn: getAnuncios, // Función que obtiene los datos desde el API
    staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
  });

  // Creación de un nuevo anuncio
export const useCrearAnuncio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAnuncios, // Llamada al API para crear
    // Al finalizar, se invalida la caché para actualizar visualmente la lista
    onSuccess: () => queryClient.invalidateQueries(["anuncios"]),
  });
};

// Actualización de un anuncio existente
export const useUpdateAnuncio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAnuncios,
    onSuccess: () => queryClient.invalidateQueries(["anuncios"]),
  });
};

// Eliminación de un anuncio
export const useDeleteAnuncio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAnuncios,
    onSuccess: () => queryClient.invalidateQueries(["anuncios"]),
  });
};

// Exportación de anuncios a Excel (no modifica caché)
export const useExportarExcelAnuncios = () => {
  return useMutation({
    mutationFn: exportarExcelAnuncios,
  });
};