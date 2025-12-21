/**
 * ===============================================================
 * Archivo: UsuarioAuth.js
 *
 * Propósito del componente:
 * Gestionar la verificación del usuario autenticado y proporcionar
 * acceso a la información del perfil del usuario que ha iniciado sesión.
 *
 * Funcionalidades clave:
 * - Solicita datos del usuario autenticado al servidor.
 * - Devuelve únicamente la información relevante del perfil.
 * - Centraliza la llamada HTTP para un consumo más limpio en el frontend.
 * ===============================================================
 */

import axiosClient from "./axiosClient";

// Acción asíncrona que solicita al backend los datos del usuario logueado
export const getUsuarioActual = async () => {
  // Realiza una petición GET al endpoint destinado a obtener el usuario actual
  const response = await axiosClient.get("/Usuario/actual");

  // Retorna solo el resultado útil recibido desde la API
  return response.data.resultado;
};
