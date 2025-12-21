/**
 * permissionUtils.js
 *
 * Descripción del proyecto:
 * Función utilitaria para la aplicación Kallewear que maneja la verificación de permisos de usuario
 * en la interfaz, permitiendo mostrar u ocultar elementos según los permisos asignados.
 *
 * Funcionalidades clave:
 * 1. Evalúa si un usuario posee un permiso específico antes de mostrar una acción o componente.
 * 2. Permite manejar interfaces dinámicas basadas en roles y permisos de manera centralizada.
 *
 * Propósito:
 * Mejorar la seguridad y la experiencia de usuario asegurando que solo se muestren elementos
 * accesibles según los permisos del usuario, manteniendo consistencia y control en toda la aplicación.
 */

// Verifica si el usuario tiene el permiso requerido
export const hasPermiso = (permiso, userPermisos = []) => {
  if (!permiso) return true; // Si no se requiere permiso, se permite siempre
  return userPermisos.includes(permiso); // Retorna true si el permiso está en la lista de permisos del usuario
};
