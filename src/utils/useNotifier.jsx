// src/utils/useNotifier.jsx
"use client";

import { toast } from "sonner";

export const useNotifier = () => {
  /**
   * Mensaje de éxito
   * @param {string} message - Mensaje que quieres mostrar
   * @param {object} options - Opciones adicionales de Sonner (opcional)
   */
  const success = (message, options = {}) => toast.success(message, options);

  /**
   * Mensaje de error
   * @param {string} message - Mensaje que quieres mostrar
   * @param {object} options - Opciones adicionales de Sonner (opcional)
   */
  const error = (message, options = {}) => toast.error(message, options);

  /**
   * Mensaje informativo
   * @param {string} message - Mensaje que quieres mostrar
   * @param {object} options - Opciones adicionales de Sonner (opcional)
   */
  const info = (message, options = {}) => toast.info(message, options);

  /**
   * Mensaje de advertencia
   * @param {string} message - Mensaje que quieres mostrar
   * @param {object} options - Opciones adicionales de Sonner (opcional)
   */
  const warning = (message, options = {}) => toast.warning(message, options);

  /**
   * Mensaje basado en promesa (ideal para React Query / CRUD)
   * @param {Promise} promise - Promesa a observar
   * @param {object} messages - Mensajes del ciclo de vida
   * @param {string} messages.loading - Mensaje mientras se procesa
   * @param {string} messages.success - Mensaje si la promesa se resuelve
   * @param {string} messages.error - Mensaje si la promesa falla
   * @param {object} options - Opciones adicionales de Sonner (opcional)
   * @returns {Promise} Devuelve la misma promesa para encadenar acciones
   */
  const promise = async (
    promise,
    { loading, success, error },
    options = {}
  ) => {
    await toast.promise(promise, {
      loading,
      success,
      error,
      ...options,
    });

    return promise;
  };

  /**
   * Confirmación visual asincrónica (NO rompe el diseño Sonner)
   * @param {object} config - Configuración de confirmación
   * @param {string} config.message - Mensaje principal
   * @param {string} [config.confirmText="Confirmar"]
   * @param {string} [config.cancelText="Cancelar"]
   * @returns {Promise<boolean>}
   */
  const confirmAsync = ({
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
  }) =>
    new Promise((resolve) => {
      toast(message, {
        duration: Infinity,
        action: {
          label: confirmText,
          onClick: () => resolve(true),
        },
        cancel: {
          label: cancelText,
          onClick: () => resolve(false),
        },
        onDismiss: () => resolve(false),
      });
    });

  return {
    success,
    error,
    info,
    warning,
    promise,
    confirmAsync,
  };
};
