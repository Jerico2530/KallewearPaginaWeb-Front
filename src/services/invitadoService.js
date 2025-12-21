// src/services/invitadoService.js
import axiosClient from "../api/axiosClient";

export const obtenerTokenInvitado = async () => {
  try {
    const { data } = await axiosClient.get("/Invitado");

    const {
      token,
      roles,
      usuarioId,
      nombreCompleto,
      correoElectronico,
      permisos
    } = data;

    // Guardar todo
    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(roles));
    localStorage.setItem("usuarioId", usuarioId);
    localStorage.setItem("nombreCompleto", nombreCompleto);
    localStorage.setItem("correoElectronico", correoElectronico);
    localStorage.setItem("permisos", JSON.stringify(permisos));

    return data;
  } catch (error) {
    console.error("Error obteniendo token de invitado", error);
    return null;
  }
};
