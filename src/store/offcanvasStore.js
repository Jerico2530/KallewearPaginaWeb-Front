/**
 * useOffcanvasStore.js
 *
 * Descripción del proyecto:
 * Este store gestiona la visibilidad de elementos deslizables (offcanvas) en la tienda online Kallewear,
 * incluyendo el carrito de compras y los filtros móviles, mejorando la experiencia de navegación.
 *
 * Funcionalidades clave:
 * 1. `carritoVisible`: indica si el carrito está visible.
 * 2. `toggleCarrito`: alterna la visibilidad del carrito.
 * 3. `setCarritoVisible`: establece explícitamente la visibilidad del carrito.
 * 4. `filtroVisible`: indica si el filtro móvil está visible.
 * 5. `toggleFiltro`: alterna la visibilidad del filtro móvil.
 * 6. `setFiltroVisible`: establece explícitamente la visibilidad del filtro móvil.
 *
 * Propósito:
 * Facilitar el control de elementos UI deslizables de manera centralizada,
 * manteniendo consistencia y simplificando la lógica de visibilidad en toda la aplicación.
 */

import { create } from "zustand";

const useOffcanvasStore = create((set) => ({
  // Carrito
  carritoVisible: false, // Estado inicial de visibilidad del carrito
  toggleCarrito: () =>
    set((state) => ({ carritoVisible: !state.carritoVisible })), // Alterna el carrito
  setCarritoVisible: (visible) => set({ carritoVisible: visible }), // Establece visibilidad del carrito

  // Filtro móvil
  filtroVisible: false, // Estado inicial de visibilidad del filtro móvil
  toggleFiltro: () => set((state) => ({ filtroVisible: !state.filtroVisible })), // Alterna el filtro
  setFiltroVisible: (visible) => set({ filtroVisible: visible }), // Establece visibilidad del filtro
}));

export default useOffcanvasStore;
