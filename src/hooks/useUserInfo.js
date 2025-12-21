/**
 * useUserInfo Hook
 * ---------------------------------------------------------------------
 * Este archivo encapsula la lógica para obtener la información del
 * usuario actualmente autenticado dentro del sistema.
 *
 * Propósito del módulo:
 * - Identificar al usuario en sesión mediante su identificador
 *   persistido en localStorage.
 * - Vincular dicho identificador con la información completa obtenida
 *   desde la API, proporcionando acceso directo a los datos del usuario.
 *
 * Funcionalidades clave:
 * - Accede al listado completo de usuarios utilizando el hook global.
 * - Recupera el usuarioId almacenado en el navegador tras el inicio de sesión.
 * - Devuelve el objeto del usuario autenticado para su consumo en componentes.
 */
import { useUsuarios } from "../hooks/useUsuario";

export default function useUserInfo() {
  // Se consume el hook global que gestiona el estado remoto de los usuarios
  const { data: usuarios, isLoading } = useUsuarios();

  // Se obtiene el ID del usuario almacenado localmente
  const usuarioId = localStorage.getItem("usuarioId");
  console.log("📦 localStorage usuarioId:", usuarioId); // debug
  console.log("📦 usuarios desde API:", usuarios); // debug

  // Mientras los usuarios se cargan o aún no se encuentran disponibles
  if (isLoading || !usuarios) return null;

  // Búsqueda en la colección por coincidencia exacta del identificador
  const user = usuarios.find((u) => u.usuarioId?.toString() === usuarioId);
  // Devuelve el usuario autenticado o null si no se encuentra
  return user || null;
}
