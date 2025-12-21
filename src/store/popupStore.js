/**
 * popupStore.js
 *
 * Descripción del proyecto:
 * Este store centraliza el control de ventanas emergentes (popups) en la tienda online Kallewear,
 * incluyendo login, registro y ordenes, garantizando consistencia en la interfaz de usuario.
 *
 * Funcionalidades clave:
 * 1. `loginPopup`, `registerPopup`, `orderPopup`: estados booleanos que indican si cada popup está visible.
 * 2. `toggleLoginPopup`, `toggleRegisterPopup`, `toggleOrderPopup`: funciones que alternan la visibilidad de cada popup.
 * 3. `setLoginPopup`, `setRegisterPopup`, `setOrderPopup`: setters directos para controlar explícitamente la visibilidad.
 *
 * Propósito:
 * Facilitar la gestión de popups de manera centralizada, simplificando la lógica de UI
 * y mejorando la experiencia del usuario al interactuar con los distintos modales de la aplicación.
 */
import { create } from "zustand";

const usePopupStore = create((set) => ({
  loginPopup: false, // Estado inicial de visibilidad del popup de login
  registerPopup: false, // Estado inicial de visibilidad del popup de registro
  orderPopup: false, // Estado inicial de visibilidad del popup de órdenes

  toggleLoginPopup: () => set((state) => ({ loginPopup: !state.loginPopup })), // Alterna popup de login
  toggleRegisterPopup: () =>
    set((state) => ({ registerPopup: !state.registerPopup })), // Alterna popup de registro
  toggleOrderPopup: () => set((state) => ({ orderPopup: !state.orderPopup })), // Alterna popup de ordenes

  // Setters directos
  setLoginPopup: (value) => set({ loginPopup: value }), // Establece visibilidad de login
  setRegisterPopup: (value) => set({ registerPopup: value }), // Establece visibilidad de registro
  setOrderPopup: (value) => set({ orderPopup: value }), // Establece visibilidad de órdenes
}));

export default usePopupStore;
