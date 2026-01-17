/**
 * searchUtils.js
 * --------------------------------------------------
 * Utilidades para normalizar texto y convertir
 * cualquier tipo de dato en valores buscables.
 *
 * ✔ Texto
 * ✔ Números
 * ✔ Fechas
 * ✔ Booleanos
 * ✔ Escalable y reutilizable
 */

/**
 * Normaliza cualquier valor a texto comparable
 */
export const normalize = (value) =>
  value?.toString().trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Convierte cualquier tipo de dato en valores buscables
 */
export const getSearchableValues = (value, key = "") => {
  if (value == null) return [];

  // Booleanos
  if (typeof value === "boolean") {
    return [value ? "activo" : "inactivo"];
  }

  // Números (orden, id, precio)
  if (typeof value === "number" || !isNaN(value)) {
    const num = Number(value);
    return [
      num.toString(), // 1
      num.toFixed(0), // 1
      num.toFixed(2), // 1.00
    ];
  }

  // Fechas (string o Date)
  if (key.toLowerCase().includes("fecha")) {
    const fecha = new Date(value);
    if (isNaN(fecha)) return [];

    return [
      fecha.toLocaleDateString("es-PE"), // 20/11/2025
      fecha.toISOString().split("T")[0], // 2025-11-20
      fecha.getFullYear().toString(), // 2025
      (fecha.getMonth() + 1).toString(), // 11
      fecha.toLocaleString("es-PE", { month: "long" }), // noviembre
    ];
  }

  // Texto normal
  return [value.toString()];
};
