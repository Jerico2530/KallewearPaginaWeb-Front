/**
 * useDetalleTarjetas Hooks
 * ---------------------------------------------------------------------
 * Este archivo centraliza la lógica de consulta, creación, actualización,
 * eliminación y exportación de DetalleTarjetas dentro del sistema.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables para gestionar eficientemente el estado remoto
 *   de los DetalleTarjetas mediante React Query.
 * - Mantener sincronizada la información en UI utilizando estrategias de
 *   caché, revalidación automática y mutaciones seguras.
 *
 * Funcionalidades clave:
 * - useDetalleTarjetas: consulta general del listado de DetalleTarjetas.
 * - useDetalleTarjetaById: obtiene los datos detallados de un DetalleTarjeta específico.
 * - useCreateDetalleTarjeta / useUpdateDetalleTarjeta / useDeleteDetalleTarjeta:
 *   acciones de mantenimiento con invalidación automática del caché.
 * - useExportarExcelDetalleTarjetas: permite exportar el dataset a Excel sin
 *   modificar el estado almacenado.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDetalleTarjetas,
  createDetalleTarjetas,
  updateDetalleTarjetas,
  deleteDetalleTarjetas,
  getDetalleTarjetasById,
  exportarExcelDetalleTarjetas,
} from "../api/DetalleTarjeta";

// Consulta principal: recupera todos los DetalleTarjetas
export const useDetalleTarjetas = () => {
  return useQuery({
    queryKey: ["detalleTarjetas"], // Identifica el recurso en caché
    queryFn: getDetalleTarjetas, // Solicita los datos al servidor
    staleTime: 1000 * 60 * 5, // Tiempo en que los datos se consideran frescos
  });
};

// Consulta de un DetalleTarjeta específico según su ID
export const useDetalleTarjetaById = (DetalleTarjetaId) =>
  useQuery({
    queryKey: ["detalleTarjeta", DetalleTarjetaId], // Clave única vinculada al ID
    queryFn: () => getDetalleTarjetasById(DetalleTarjetaId), // API para detalle del DetalleTarjeta
    enabled: !!DetalleTarjetaId, // Evita la consulta si no existe un ID válido
    staleTime: 1000 * 60 * 5, // Tiempo en que los datos se consideran frescos
  });

// Creación de un nuevo DetalleTarjeta (revalida el listado tras completarse)
export const useCreateDetalleTarjeta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDetalleTarjetas,
    onSuccess: () => queryClient.invalidateQueries(["detalleTarjetas"]),
  });
};

// Actualización de un DetalleTarjeta existente (sincroniza la caché)
export const useUpdateDetalleTarjeta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDetalleTarjetas,
    onSuccess: () => queryClient.invalidateQueries(["detalleTarjetas"]),
  });
};

// Eliminación de un DetalleTarjeta (refresca el listado en pantalla)
export const useDeleteDetalleTarjeta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDetalleTarjetas,
    onSuccess: () => queryClient.invalidateQueries(["detalleTarjetas"]),
  });
};

// Exportación de DetalleTarjetas a Excel (no requiere refrescar la caché)
export const useExportarExcelDetalleTarjetas = () => {
  return useMutation({
    mutationFn: exportarExcelDetalleTarjetas,
  });
};
