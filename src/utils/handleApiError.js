
export const handleApiError = (error, notify, { debug = false } = {}) => {
  let message = null; // null = si no hay mensaje claro, no notificar al usuario
  let detalleTecnico = null;

  try {
    if (error?.response?.data) {
      const data = error.response.data;

      // Caso 1: errores múltiples del backend
      if (Array.isArray(data.erroresMessages) && data.erroresMessages.length > 0) {
        const mensajes = data.erroresMessages.map(e => e.mensaje?.trim()).filter(Boolean);

        // Detectar mensajes técnicos
        const esTecnico = mensajes.some(m =>
          /UserRoles|Relaciones|SQL|NullReference|constraint|inner exception|violates foreign key/i.test(m)
        );

        if (esTecnico) {
          message = "No se puede completar la acción porque este registro está relacionado con otros datos.";
          detalleTecnico = mensajes.join(" | ");
        } else {
          message = mensajes.join(" | ");
        }

      // Caso 2: mensaje único del backend
      } else if (data.mensaje) {
        message = data.mensaje.trim();
      }

    // Caso 3: error genérico (sin response del backend)
    } else if (error?.message) {
      if (/Network Error/i.test(error.message)) {
        message = "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
      } else if (/timeout/i.test(error.message)) {
        message = "El servidor tardó demasiado en responder. Inténtalo nuevamente.";
      } else {
        message = error.message;
      }
    }

    // Caso 4: si el backend no envió mensaje
    if (!message) {
      message = "Ocurrió un error inesperado. Inténtalo nuevamente.";
    }

    // 📣 Mostrar solo mensajes filtrados al usuario
    if (notify?.error) {
      notify.error(message);
    } else if (typeof notify === "function") {
      notify(message, { variant: "error" });
    } else {
      console.error("[Error API]", message);
    }

    // 💻 Mostrar detalles técnicos en consola solo en modo debug
    if (debug && detalleTecnico) {
      console.warn("🧠 Detalle técnico:", detalleTecnico);
    }
  } catch (e) {
    console.error("❌ Error al manejar error:", e);
    notify?.error?.("Ocurrió un error inesperado al procesar la solicitud.");
  }
};
