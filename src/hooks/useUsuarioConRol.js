/**
 * useUsuarioConRol Hook
 * ---------------------------------------------------------------------
 * Este módulo combina la información del usuario autenticado con
 * los roles asignados en el sistema, generando un perfil completo
 * del usuario activo.
 *
 * Propósito del componente:
 * - Unificar la data del usuario y sus permisos provenientes de
 *   diferentes consultas.
 * - Proveer un acceso más directo al rol asignado sin necesidad
 *   de que los componentes realicen lógica adicional.
 *
 * Funcionalidades clave:
 * - Obtiene el usuario autenticado desde la sesión actual.
 * - Busca el rol correspondiente dentro de la lista global de roles.
 * - Retorna el estado de la consulta junto con el nombre del rol,
 *   facilitando control de acceso y visibilidad en la interfaz.
 */
import { useUsuarioActual } from "./useUsuarioActual";
import { useUserRoles } from "./useUserRole";

export const useUsuarioConRol = () => {
  const usuarioQuery = useUsuarioActual(); // Datos del usuario autenticado
  const rolesQuery = useUserRoles(); // Lista de roles obtenidos del servidor
  // Encuentra el rol correspondiente a este usuario (si no existe, asigna "Invitado")
  const rolUsuario =
    rolesQuery.data?.find((r) => r.usuarioId === usuarioQuery.data?.usuarioId)
      ?.nombreRol || "Invitado";

  return {
    ...usuarioQuery, // Retorna todo el estado de consulta del usuario
    rolUsuario, // Información adicional calculada
  };
};
