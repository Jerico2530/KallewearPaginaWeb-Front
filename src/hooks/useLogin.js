/**
 * useLogin Hook
 * ---------------------------------------------------------------------
 * Permitiendo iniciar sesión de forma segura y
 * sincronizar los datos con el estado global de la aplicación.
 *
 * Propósito del módulo:
 * - Ejecutar la solicitud de autenticación contra el servidor.
 * - Decodificar el token JWT para obtener roles y validar accesos.
 * - Almacenar la información del usuario autenticado en el estado global.
 * - Migrar automáticamente el carrito del invitado al usuario logueado,
 *   manteniendo la continuidad de compra.
 *
 * Funcionalidades clave:
 * - useLogin: valida credenciales, almacena datos, roles y permisos.
 * - Migración automática del carrito de invitado, eliminando dependencias
 *   temporales tras el inicio de sesión.
 */
import { useMutation } from "@tanstack/react-query";
import { createLogin } from "../api/Login";
import useUserStore from "../store/userStore";
import { jwtDecode } from "jwt-decode";

export const useLogin = () => {
  // Almacena datos del usuario en el estado global
  const setUser = useUserStore((state) => state.setUser);

  // Hook de autenticación
  return useMutation({
    mutationFn: createLogin, // Envía las credenciales al servidor
    onSuccess: async  (data) => {
      const token = data?.token || null;
      const usuario = data?.usuario || {};

      const invitadoId = localStorage.getItem("invitadoId"); // Identifica carrito temporal del invitado

      // Decodificación del token para obtener roles
      let rolesFromToken = [];
      if (token) {
        const decoded = jwtDecode(token);
        const rolesClaim =
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        rolesFromToken = Array.isArray(rolesClaim) ? rolesClaim : [rolesClaim];
      }

      // Guardamos usuario completo en store y localStorage
      setUser({
        token,
        usuario: {
          usuarioId: usuario.usuarioId || null,
          nombreCompleto: usuario.nombreCompleto || "",
          apellidoCompleto: usuario.apellidoCompleto || "",
          correoElectronico: usuario.correoElectronico || "",
          fechaNacimiento: usuario.fechaNacimiento || null,
          dni: usuario.dni || null,
          imagen: usuario.imagen || null,
          estado: usuario.estado ?? true,
          fechaRegistro: usuario.fechaRegistro || new Date().toISOString(),
          roles: usuario.roles || rolesFromToken,
          permisos: usuario.permisos || [],
        },
      });
      // Migración del carrito de invitado (si existe)
      if (invitadoId) {
        try {
            await axiosClient.post(`/carrito/migrar`, {
                invitadoId,
                usuarioId: usuario.usuarioId
            });
        } catch (e) {
            console.error("Error migrando carrito:", e);
        } finally {
            localStorage.removeItem("invitadoId"); // Limpieza del identificador temporal
        }
    }
    },
    onError: (error) => {
      console.error("Error login:", error);// Registro de errores de autenticación
    },
  });
};
