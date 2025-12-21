/**
 * useNoticias Hooks
 * ---------------------------------------------------------------------
 * Este archivo centraliza la lógica de consulta, creación, actualización,
 * eliminación y exportación de noticias dentro del sistema.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables que permitan gestionar de forma eficiente
 *   el estado remoto del catálogo de noticias mediante React Query.
 * - Mantener sincronización automática con el servidor, aplicando
 *   estrategias de revalidación y controles de caché optimizados.
 *
 * Funcionalidades clave:
 * - useNoticias: obtiene y mantiene las noticias sincronizadas con el backend.
 * - useCrearNoticia / useActualizarNoticia / useEliminarNoticia:
 *   operaciones CRUD con actualización automática del caché.
 * - useExportarExcelNoticias:
 *   genera un archivo Excel sin alterar el estado almacenado.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNoticias,
  createNoticias,
  updateNoticias,
  deleteNoticias,
  exportarExcelNoticias,
} from "../api/Noticias";

// Consulta principal: obtiene la lista de noticias desde el servidor
export const useNoticias = () =>
  useQuery({
    queryKey: ["noticias"], // Identificador único del recurso en caché
    queryFn: getNoticias, // Función encargada de recuperar los datos
    staleTime: 1000 * 60 * 5, // Tiempo en que los datos se consideran frescos
  });

// Creación de una nueva noticia con refresco automático de datos en caché
export const useCrearNoticia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNoticias,
    onSuccess: () => queryClient.invalidateQueries(["noticias"]),
  });
};

// Actualización de una noticia existente y revalidación de datos
export const useActualizarNoticia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNoticias,
    onSuccess: () => queryClient.invalidateQueries(["noticias"]),
  });
};

// Eliminación de una noticia con actualización de la UI tras confirmación del backend
export const useEliminarNoticia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNoticias,
    onSuccess: () => queryClient.invalidateQueries(["noticias"]),
  });
};

// Exporta todas las noticias a Excel sin necesidad de revalidar el recurso
export const useExportarExcelNoticias = () => {
  return useMutation({
    mutationFn: exportarExcelNoticias,
  });
};
