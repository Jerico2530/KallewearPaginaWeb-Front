/**
 * useUserStore.js
 *
 * Descripción del proyecto:
 * Este store gestiona la autenticación y los datos del usuario en la aplicación Kallewear,
 * permitiendo alternar entre usuarios invitados y usuarios registrados, así como manejar
 * roles, permisos y datos personales de manera centralizada.
 *
 * Funcionalidades clave:
 * 1. Estado inicial: carga desde localStorage los datos del usuario o establece valores predeterminados de invitado.
 * 2. setUser(data): almacena los datos de un usuario registrado y actualiza el localStorage.
 * 3. setGuest(data): almacena los datos de un usuario invitado, sin sobrescribir un usuario real existente.
 * 4. logout(): limpia el localStorage y reestablece el usuario como invitado mediante la API de loginInvitado.
 *
 * Propósito:
 * Centralizar la gestión del usuario para la autenticación, roles, permisos y datos personales,
 * asegurando consistencia entre la interfaz de usuario y el almacenamiento local.
 */
import { create } from "zustand";
import { loginInvitado } from "../api/Login";

const useUserStore = create((set) => ({
  // Cargar datos iniciales desde localStorage
  token: localStorage.getItem("token") || null,
  roles: JSON.parse(localStorage.getItem("roles") || '["Invitado"]'),
  permisos: JSON.parse(localStorage.getItem("permisos") || "[]"),
  usuarioId: localStorage.getItem("usuarioId") || null,
  nombreCompleto: localStorage.getItem("nombreCompleto") || "Invitado",
  apellidoCompleto: localStorage.getItem("apellidoCompleto") || "Invitados",
  dni: localStorage.getItem("dni") || null,
  correoElectronico: localStorage.getItem("correoElectronico") || "invitado@demo.com",
  imagen: localStorage.getItem("imagen") || null, // <-- NUEVO CAMPO
  isGuest: JSON.parse(localStorage.getItem("isGuest") ?? "true"),

  // Guardar usuario logueado
  setUser: (data) => {
    const { token, usuario } = data;
    const invitadoId = localStorage.getItem("usuarioId");
    localStorage.setItem("invitadoId", invitadoId);
    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(usuario.roles || ["Invitado"]));
    localStorage.setItem("permisos", JSON.stringify(usuario.permisos || []));
    localStorage.setItem("usuarioId", usuario.usuarioId);
    localStorage.setItem("nombreCompleto", usuario.nombreCompleto || "");
    localStorage.setItem("apellidoCompleto", usuario.apellidoCompleto || "");
    localStorage.setItem("dni", usuario.dni || "");
    localStorage.setItem("correoElectronico", usuario.correoElectronico || "");
    localStorage.setItem("imagen", usuario.imagen || "");
    localStorage.setItem("isGuest", "false");

    set({
      token,
      roles: usuario.roles || ["Invitado"],
      permisos: usuario.permisos || [],
      usuarioId: usuario.usuarioId,
      nombreCompleto: usuario.nombreCompleto || "",
      apellidoCompleto: usuario.apellidoCompleto || "",
      dni: usuario.dni || "",
      correoElectronico: usuario.correoElectronico || "",
      imagen: usuario.imagen || "",
      isGuest: false,
    });
  },

  // Guardar usuario invitado
  setGuest: (data) => {
    const { token, usuario } = data;
    const existingToken = localStorage.getItem("token");

    //  Si ya hay un token de usuario real, no sobrescribir
    if (existingToken && existingToken !== token) return;

    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(usuario.roles || ["Invitado"]));
    localStorage.setItem("permisos", JSON.stringify(usuario.permisos || []));
    localStorage.setItem("usuarioId", usuario.usuarioId);
    localStorage.setItem("nombreCompleto", usuario.nombreCompleto || "Invitado");
    localStorage.setItem("apellidoCompleto", usuario.apellidoCompleto || "Invitados");
    localStorage.setItem("dni", usuario.dni || "99999999");
    localStorage.setItem("correoElectronico", usuario.correoElectronico || "invitado@demo.com");
    localStorage.setItem("imagen", usuario.imagen || "https://i.imgur.com/GpxMW2T.png");
    localStorage.setItem("isGuest", "true");

    set({
      token,
      roles: usuario.roles || ["Invitado"],
      permisos: usuario.permisos || [],
      usuarioId: usuario.usuarioId,
      nombreCompleto: usuario.nombreCompleto || "Invitado",
      apellidoCompleto: usuario.apellidoCompleto || "Invitados",
      dni: usuario.dni || "99999999",
      correoElectronico: usuario.correoElectronico || "invitado@demo.com",
      imagen: usuario.imagen || "https://i.imgur.com/GpxMW2T.png",
      isGuest: true,
    });
  },

  // Logout → vuelve a invitado
  logout: async () => {
    localStorage.clear();
    localStorage.setItem("isGuest", "true");

    const data = await loginInvitado();
    const { token, usuario } = data;

    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(usuario.roles || ["Invitado"]));
    localStorage.setItem("permisos", JSON.stringify(usuario.permisos || []));
    localStorage.setItem("usuarioId", usuario.usuarioId);
    localStorage.setItem("nombreCompleto", usuario.nombreCompleto || "Invitado");
    localStorage.setItem("apellidoCompleto", usuario.apellidoCompleto || "Invitados");
    localStorage.setItem("dni", usuario.dni || "99999999");
    localStorage.setItem("correoElectronico", usuario.correoElectronico || "invitado@demo.com");
    localStorage.setItem("imagen", usuario.imagen || "https://i.imgur.com/GpxMW2T.png");
    localStorage.setItem("isGuest", "true");

    set({
      token,
      roles: usuario.roles || ["Invitado"],
      permisos: usuario.permisos || [],
      usuarioId: usuario.usuarioId,
      nombreCompleto: usuario.nombreCompleto || "Invitado",
      apellidoCompleto: usuario.apellidoCompleto || "Invitados",
      dni: usuario.dni || "99999999",
      correoElectronico: usuario.correoElectronico || "invitado@demo.com",
      imagen: usuario.imagen || "https://i.imgur.com/GpxMW2T.png",
      isGuest: true,
    });
  },
}));

export default useUserStore;
