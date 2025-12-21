/**
 * accessUtils.js
 *
 * Descripción del proyecto:
 * Función utilitaria para la aplicación Kallewear que gestiona la verificación de roles de usuario
 * para determinar el acceso a ciertos elementos de la interfaz o funcionalidades específicas.
 *
 * Funcionalidades clave:
 * 1. Evalúa si un usuario posee al menos un rol requerido para acceder a un recurso o componente.
 * 2. Soporta tanto un único rol de usuario como múltiples roles.
 * 3. Permite un control dinámico de la visibilidad de elementos según roles asignados.
 *
 * Propósito:
 * Mejorar la seguridad y experiencia de usuario, asegurando que solo los usuarios con los roles
 * adecuados puedan acceder a ciertas funcionalidades o secciones de la aplicación.
 */

// Determina si el usuario tiene acceso según sus roles
export const hasAccess = (itemRoles, userRoles) => {
  if (!itemRoles) return true; // Si no se requieren roles, el acceso siempre es permitido
  if (!Array.isArray(userRoles)) return itemRoles.includes(userRoles); // Comparar si el usuario tiene un solo rol
  return userRoles.some((r) => itemRoles.includes(r)); // Retorna true si al menos un rol del usuario coincide con los roles requeridos
};
