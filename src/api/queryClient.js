/**
 * ===============================================================
 * Archivo: queryClient.js
 * 
 * Propósito del componente:
 * Este archivo configura y exporta la instancia principal de
 * React Query para el manejo de solicitudes HTTP, caché de datos
 * y control del estado asíncrono en toda la aplicación.
 *
 * Funcionalidades clave:
 * - Gestión de caché optimizada para evitar datos obsoletos.
 * - Configuración global del comportamiento de las consultas.
 * - Centralización de la capa de datos para un consumo eficiente.
 * ===============================================================
 */
import { QueryClient } from "@tanstack/react-query";

// Instancia principal de React Query, encargada de controlar el flujo de datos
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Los datos no permanecen en caché y se consideran obsoletos inmediatament
      staleTime: 0,
      cacheTime: 0,
      // Evita refetch automático al volver a la ventana del navegador
      refetchOnWindowFocus: false,
      // Desactiva reintentos automáticos en caso de error
      retry: false,
    },
  },
});
