/**
 * useBalanceStore.js
 *
 * Descripción del proyecto:
 * Este store maneja el estado de "balanceo" de la interfaz en la tienda online Kallewear,
 * utilizado para animaciones visuales que indican interacción con el carrito de compras.
 *
 * Funcionalidades clave:
 * 1. Mantiene un estado booleano `balanceo` para indicar si la animación está activa.
 * 2. Permite activar o desactivar la animación mediante la función `toggleBalanceo`.
 * 3. Desactiva automáticamente la animación después de un breve intervalo.
 *
 * Propósito:
 * Mejorar la experiencia del usuario al proporcionar retroalimentación visual
 * cuando se agregan productos al carrito, haciendo la interfaz más interactiva y dinámica.
 */
import { create } from "zustand";
// Creación del store con Zustand
const useBalanceStore = create((set) => ({
  balanceo: false, // Estado inicial de la animación de balanceo
  // Función para activar/desactivar el balanceo
  toggleBalanceo: (value) => {
    set({ balanceo: value }); // Activar o desactivar el balanceo
    if (value) {
      setTimeout(() => set({ balanceo: false }), 500); // Desactivar después de 1 segundo
    }
  },
}));

export default useBalanceStore;
