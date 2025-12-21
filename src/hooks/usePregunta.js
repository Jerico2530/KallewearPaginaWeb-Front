/**
 * usePreguntas Hooks
 * ---------------------------------------------------------------------
 * Este módulo centraliza la gestión de preguntas dentro del sistema,
 * abarcando operaciones de consulta, creación, actualización, eliminación
 * y exportación de datos.
 *
 * Propósito del componente:
 * - Proveer hooks reutilizables para manejar el estado remoto de preguntas
 *   mediante React Query de manera eficiente y desacoplada.
 * - Mejorar el rendimiento aprovechando caché, revalidación automática,
 *   sincronización con el servidor y actualización de datos al modificar recursos.
 *
 * Funcionalidades clave:
 * - usePreguntas: consulta y mantiene sincronizado el listado de preguntas.
 * - useCrearPregunta / useUpdatePregunta / useDeletePregunta:
 *   hooks orientados al mantenimiento del recurso con refresco automático del caché.
 * - useExportarExcelPreguntas: exporta los datos a un archivo Excel sin alterar el estado actual.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPreguntas,
  createPreguntas,
  updatePreguntas,
  deletePreguntas,
  exportarExcelPreguntas,
} from "../api/Pregunta";

// Obtiene el listado de preguntas y las mantiene sincronizadas con el servidor
export const usePreguntas = () =>
  useQuery({
    queryKey: ["preguntas"], // Clave única en caché
    queryFn: getPreguntas, // Función que realiza la consulta al API
    staleTime: 1000 * 60 * 5, // Tiempo durante el cual los datos se consideran frescos
  });

  // Creación de una nueva pregunta (actualiza la caché tras el éxito)
export const useCrearPregunta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPreguntas,
    onSuccess: () => queryClient.invalidateQueries(["preguntas"]),
  });
};

// Actualización de una pregunta existente
export const useUpdatePregunta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePreguntas,
    onSuccess: () => queryClient.invalidateQueries(["preguntas"]),
  });
};

// Eliminación de una pregunta del catálogo
export const useDeletePregunta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePreguntas,
    onSuccess: () => queryClient.invalidateQueries(["preguntas"]),
  });
};

// Exportación del registro de preguntas a Exce
export const useExportarExcelPreguntas = () => {
  return useMutation({
    mutationFn: exportarExcelPreguntas,
  });
};
