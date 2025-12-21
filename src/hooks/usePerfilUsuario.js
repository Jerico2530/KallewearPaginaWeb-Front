/**
 * useUsuarioActual Hook
 * ---------------------------------------------------------------------
 * Este archivo centraliza la lógica de consulta del perfil del usuario
 * autenticado dentro del sistema.
 *
 * Propósito del módulo:
 * - Proveer un hook reutilizable que mantenga sincronizada la información
 *   del usuario actualmente autenticado con el servidor.
 * - Mejorar el rendimiento aplicando almacenamiento en caché y control
 *   de reintentos ante fallos temporales.
 *
 * Funcionalidades clave:
 * - useUsuarioActual: obtiene el perfil del usuario y lo conserva en caché
 *   durante un tiempo determinado, evitando solicitudes innecesarias.
 */
import { useQuery } from "@tanstack/react-query";
import { getUsuarioActual } from "../api/UsuarioAuth";

// Consulta del usuario autenticado actualmente
export const useUsuarioActual = () => {
  return useQuery({
    queryKey: ["usuarioActual"], // Identifica el recurso del usuario activo
    queryFn: getUsuarioActual, // Llama al servicio de autenticación
    staleTime: 1000 * 60 * 5, // Datos considerados frescos durante 5 min
    retry: 1, // Reintenta una vez en caso de error de red
  });
};
