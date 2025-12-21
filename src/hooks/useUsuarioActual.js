/**
 * useUsuarioActual Hook
 * ---------------------------------------------------------------------
 * Este módulo gestiona la obtención y sincronización del usuario
 * autenticado dentro de la aplicación.
 *
 * Propósito del componente:
 * - Verificar el estado de autenticación y obtener datos del usuario
 *   activo desde el servidor.
 * - Mantener la información del usuario siempre actualizada y evitar
 *   el uso de datos obsoletos en memoria.
 *
 * Funcionalidades clave:
 * - Detecta automáticamente cambios en el token de sesión.
 * - Refresca los datos del usuario cada vez que el token se modifica.
 * - Evita consultas innecesarias cuando no existe una sesión válida.
 */

import { useQuery } from "@tanstack/react-query";
import { getUsuarioActual } from "../api/UsuarioAuth";
import useUserStore from "../store/userStore";

export const useUsuarioActual = () => {
  const token = useUserStore((s) => s.token); // Lee el token almacenado en el estado global (Zustand)

  return useQuery({
    queryKey: ["usuarioActual", token], // Nueva consulta si el token cambia
    queryFn: async () => {
      if (!token) return null; // Evita llamar al servidor si no hay sesión
      const data = await getUsuarioActual(); // Solicita los datos del usuario autenticado
      return data;
    },
    enabled: !!token, // Desactiva la consulta si no hay token válido
    staleTime: 0, // Los datos expiran inmediatamente; siempre información fresca
    cacheTime: 0, // No conservar datos antiguos en caché
  });
};
