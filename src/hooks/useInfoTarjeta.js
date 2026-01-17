/**
 * useInfoTarjetas Hooks
 * ---------------------------------------------------------------------
 * Este módulo administra la lógica de consulta, creación, actualización,
 * eliminación y exportación del catálogo de infoTarjetas dentro del sistema.
 *
 * Propósito del módulo:
 * - Proveer hooks reutilizables que mantengan sincronizada la información
 *   de infoTarjetas con el servidor mediante React Query.
 * - Optimizar la gestión de datos mediante caché, revalidación automática
 *   y actualización del estado remoto tras operaciones CRUD.
 *
 * Funcionalidades clave:
 * - useInfoTarjetas: obtiene y mantiene las infoTarjetas actualizadas.
 * - useCrearInfoTarjeta / useActualizarInfoTarjeta / useEliminarInfoTarjeta:
 *   manipulan los datos y actualizan la caché de manera automática.
 * - useExportarExcelInfoTarjetas: permite la exportación del catálogo sin
 *   modificar el estado almacenado.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInfoTarjetas,
  createInfoTarjetas,
  updateInfoTarjetas,
  deleteInfoTarjetas,
  exportarExcelInfoTarjetas,
  getInfoTarjetasByUsuario,
  patchInfoTarjeta,
} from "../api/InfoTarjeta";

// Consulta del listado de infoTarjetas desde el API
export const useInfoTarjetas = () => {
  return useQuery({
    queryKey: ["infoTarjetas"], // Identificador del recurso en caché
    queryFn: getInfoTarjetas, // Función que obtiene los datos del servidor
    staleTime: 1000 * 60 * 5, // Tiempo durante el cual los datos se consideran válidos
  });
};

export const useInfoTarjetasByUsuario = (usuarioId) => {
  return useQuery({
    queryKey: ["infoTarjetas", usuarioId],
    queryFn: async () => {
      if (!usuarioId) return [];

      const data = await getInfoTarjetasByUsuario(usuarioId);

      // 🧪 DEBUG IMPORTANTE
      console.log("🧪 InfoTarjetas usuarioId:", usuarioId);
      console.log("🧪 API resultado tarjetas:", data);

      // ✅ NORMALIZACIÓN CRÍTICA
      return Array.isArray(data) ? data : [];
    },
    enabled: !!usuarioId, // ⛔ evita llamadas sin usuario
    staleTime: 1000 * 60 * 5,
  });
};

// Creación de una nueva infoTarjeta (actualiza la caché tras confirmación del servidor)
export const useCrearInfoTarjeta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInfoTarjetas,
    onSuccess: () => queryClient.invalidateQueries(["infoTarjetas"]),
  });
};

// Actualización de una infoTarjeta existente
export const useActualizarInfoTarjeta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInfoTarjetas,
    onSuccess: () => queryClient.invalidateQueries(["infoTarjetas"]),
  });
};

export const usePatchInfoTarjeta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patchOps }) => patchInfoTarjeta(id, patchOps),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["infoTarjetas"]);
      queryClient.invalidateQueries(["infoTarjeta", variables.id]);
    },
  });
};

// Eliminación de infoTarjeta (sincroniza la UI con la data del servidor)
export const useEliminarInfoTarjeta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInfoTarjetas,
    onSuccess: () => queryClient.invalidateQueries(["infoTarjetas"]),
  });
};

// Exportación de infoTarjetas a Excel (no requiere invalidar caché)
export const useExportarExcelInfoTarjetas = () => {
  return useMutation({
    mutationFn: exportarExcelInfoTarjetas,
  });
};
