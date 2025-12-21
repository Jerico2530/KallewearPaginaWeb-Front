/**
 * useAuthBootstrap.js
 * ---------------------------------------------------------------------
 * Hook encargado de gestionar la sesión inicial de usuario en la aplicación,
 * asegurando que exista un estado mínimo de autenticación desde el momento
 * en que el usuario accede a la web.
 *
 * Propósito del componente:
 * - Verificar si ya existe un usuario autenticado mediante token.
 * - En caso contrario, autenticar automáticamente como invitado para
 *   habilitar funcionalidades básicas del sistema.
 *
 * Funcionalidades clave:
 * - Obtiene la sesión de invitado mediante llamada a la API.
 * - Sincroniza el usuario obtenido con el store global.
 * - Ejecuta el proceso una única vez según el estado local del navegador.
 */
import { useEffect, useCallback } from "react";
import { loginInvitado } from "../api/Login";
import useUserStore from "../store/userStore";

// Hook principal para inicializar o recuperar el estado de sesión
export const useAuthBootstrap = () => {
  // Acceso al token actual almacenado en el estado global
  const token = useUserStore((s) => s.token);
  // Acción del store para definir los datos del usuario invitado
  const setGuest = useUserStore((s) => s.setGuest);

  // Solicita datos de invitado y los persiste en el store global
  const loadGuest = useCallback(async () => {
    try {
      const data = await loginInvitado();

      // Se actualiza el estado con la sesión obtenida desde la API
      setGuest({
        token: data.token,
        usuario: data.usuario,
      });
    } catch (error) {
      console.error("Error cargando invitado:", error);
    }
  }, [setGuest]);

  useEffect(() => {
    // Si existe usuario guardado en localStorage, no se autentica invitado
    const usuarioId = localStorage.getItem("usuarioId");

    // Solo carga sesión invitado si no hay token ni usuario previo
    if (!token && !usuarioId) {
      loadGuest();
    }
  }, [token, loadGuest]);

  // Exporta la función para permitir disparar manualmente la carga si se requiere
  return { loadGuest };
};
