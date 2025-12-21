/**
 * useNavbarScroll.js
 * -------------------------------------------------
 * Custom Hook para controlar la visibilidad del Navbar
 * basado en la dirección del scroll del usuario.
 *
 * Propósito:
 * 1️⃣ Ocultar el Navbar al hacer scroll hacia abajo.
 * 2️⃣ Mostrarlo nuevamente al hacer scroll hacia arriba.
 * 3️⃣ Mejorar experiencia de usuario y limpieza visual.
 */

import { useState, useEffect } from "react";

export const useNavbarScroll = () => {
  // Estado para controlar si el navbar debe mostrarse
  const [showNavbar, setShowNavbar] = useState(true);
  // Estado para almacenar la posición vertical anterior del scroll
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Mostrar navbar si el usuario hace scroll hacia arriba
      setShowNavbar(currentScrollY < lastScrollY);  
      // Actualizar la posición anterior del scroll
      setLastScrollY(currentScrollY);
    };
    // Registrar el evento de scroll
    window.addEventListener("scroll", handleScroll);
    // Cleanup: remover listener para evitar fugas de memoria
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  // Retornar estado para usar en componentes de Navbar
  return { showNavbar };
};
