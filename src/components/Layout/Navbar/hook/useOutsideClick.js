/**
 * useOutsideClick.js
 * -------------------------------------------------
 * Custom Hook para detectar clics fuera de un elemento
 * referenciado y ejecutar una acción (callback) definida.
 * 
 * Propósito:
 * 1️⃣ Mejorar la experiencia de usuario cerrando modales, dropdowns o menús
 *    cuando el usuario hace clic fuera del componente.
 * 2️⃣ Mantener la lógica de interacción encapsulada y reutilizable.
 * 3️⃣ Evitar comportamiento inesperado al manejar eventos globales.
 *
 */

import { useEffect } from "react";

export const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    // Función que detecta si el clic ocurrió fuera del elemento referenciado
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };
    // Registrar evento global para detectar clics en el documento
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup: remover listener para evitar fugas de memoria
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
};
