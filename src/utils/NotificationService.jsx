/**
 * useNotification.js
 *
 * Descripción del proyecto:
 * Hook personalizado para la aplicación Kallewear que gestiona notificaciones tipo snackbar
 * con estilos consistentes y comportamiento configurable para distintos tipos de mensajes.
 *
 * Funcionalidades clave:
 * 1. Muestra notificaciones de éxito, error, advertencia e información con estilos y duraciones personalizadas.
 * 2. Permite mostrar mensajes persistentes con acciones de confirmación asíncronas.
 * 3. Centraliza la configuración de estilos y posición para mantener consistencia visual en toda la aplicación.
 *
 * Propósito:
 * Facilitar la comunicación de eventos importantes al usuario, como errores, confirmaciones o alertas,
 * mejorando la experiencia de usuario mediante notificaciones claras, visibles y estilizadas profesionalmente.
 */
import React from "react";
import { useSnackbar } from "notistack";
export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // Estilos base para todas las notificaciones
  const baseStyle = {
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "500",
    borderRadius: "10px",
    padding: "14px 20px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
    textAlign: "center",
    minWidth: "300px",
  };
  // Configuración común de posición y estilo adicional para notificaciones en la esquina superior derecha
  const topRightProps = {
    anchorOrigin: { vertical: "top", horizontal: "right" },
    style: {
      ...baseStyle,
      zIndex: 9999,
      marginTop: "2cm",
    },
  };
  // Métodos de notificación
  const notify = {
    // Notificación de éxito
    success: (msg) =>
      enqueueSnackbar(msg, {
        ...topRightProps,
        autoHideDuration: 2500,
        style: { ...topRightProps.style, backgroundColor: "#111" },
      }),
    // Notificación de error
    error: (msg) =>
      enqueueSnackbar(msg, {
        ...topRightProps,
        autoHideDuration: 3000,
        style: { ...topRightProps.style, backgroundColor: "#b91c1c" }, // rojo empresarial
      }),
    // Notificación de advertencia
    warning: (msg) =>
      enqueueSnackbar(msg, {
        ...topRightProps,
        autoHideDuration: 3000,
        style: { ...topRightProps.style, backgroundColor: "#f59e0b" }, // naranja
      }),
    // Notificación informativa
    info: (msg) =>
      enqueueSnackbar(msg, {
        ...topRightProps,
        autoHideDuration: 2500,
        style: { ...topRightProps.style, backgroundColor: "#1e3a8a" }, // azul
      }),
    // Notificación de confirmación asíncrona con botones personalizables
    confirmAsync: (
      mensaje,
      confirmarLabel = "Confirmar",
      cancelarLabel = "Cancelar"
    ) => {
      return new Promise((resolve) => {
        const key = enqueueSnackbar(mensaje, {
          ...topRightProps,
          persist: true, // Mensaje persistente hasta que el usuario responda
          action: () => (
            <div className="flex justify-center gap-3 mt-3">
              <button
                onClick={() => {
                  closeSnackbar(key);
                  resolve(true);
                }}
                className="px-3 py-1 rounded bg-white text-black hover:bg-gray-200 transition font-semibold text-sm"
              >
                {confirmarLabel}
              </button>

              <button
                onClick={() => {
                  closeSnackbar(key);
                  resolve(false);
                }}
                className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700 transition text-sm"
              >
                {cancelarLabel}
              </button>
            </div>
          ),
        });
      });
    },
  };

  return notify;
};
