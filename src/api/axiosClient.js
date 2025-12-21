/**
 * axiosClient.js
 *
 * Descripción del proyecto:
 * Configuración centralizada de Axios para la plataforma Kallewear, 
 * facilitando la comunicación con la API del backend.
 *
 * Funcionalidades clave:
 * 1. Define la URL base de la API para todas las solicitudes.
 * 2. Interceptor de requests: agrega automáticamente el token de usuario 
 *    autenticado a la cabecera Authorization.
 * 3. Interceptor de responses: maneja errores globales, como el 401,
 *    permitiendo cerrar sesión o redirigir al login de forma centralizada.
 *
 * Propósito:
 * Garantizar que todas las solicitudes HTTP se realicen de manera segura y consistente,
 * centralizando la lógica de autenticación y el manejo de errores.
 */
import axios from "axios";
import useUserStore from "../store/userStore";

const axiosClient = axios.create({
  baseURL: "https://localhost:7223/api", 
});

// 🔹 Interceptor de requests → agrega token automáticamente
axiosClient.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Interceptor de responses → manejar errores globales
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ejemplo: redirigir a login o refrescar token
      useUserStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
