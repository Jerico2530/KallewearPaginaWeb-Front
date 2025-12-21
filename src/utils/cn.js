/**
 * cn.js
 *
 * Descripción del proyecto:
 * Función auxiliar utilizada en la aplicación Kallewear para manejar clases CSS dinámicas
 * de manera limpia y segura, evitando clases vacías o falsas.
 *
 * Funcionalidades clave:
 * 1. Filtra los valores falsy (undefined, null, false, "") de los argumentos.
 * 2. Une las clases restantes en una cadena separada por espacios.
 *
 * Propósito:
 * Simplificar la gestión de clases dinámicas en componentes React, mejorando la legibilidad
 * y evitando errores comunes al combinar múltiples clases condicionales.
 */

export function cn(...classes) {
  // Filtra valores falsy y une las clases válidas en una sola cadena
  return classes.filter(Boolean).join(" ");
}
