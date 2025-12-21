/**
 * DarkMode.jsx
 * -------------------------------------------------
 * Componente funcional que permite al usuario alternar entre modo claro y oscuro.
 *
 * Funcionalidades clave:
 * - Muestra un botón visual que representa el tema actual (claro u oscuro).
 * - Utiliza el hook personalizado useDarkMode para gestionar el estado del tema.
 * - Aplica transiciones suaves y cambios de opacidad para mejorar la experiencia del usuario.
 *
 * Propósito:
 * Este componente centraliza el control de tema de la interfaz, permitiendo
 * una experiencia consistente en toda la aplicación y guardando la preferencia del usuario.
 */

import React from "react";
import LightButton from "../../../assets/website/light-mode-button.png";
import DarkButton from "../../../assets/website/dark-mode-button.png";
import { useDarkMode } from "../Navbar/hook/useDarkMode";

const DarkMode = () => {
  // Hook que gestiona el estado y alternancia del tema
  const { theme, toggleTheme } = useDarkMode();

  return (
    <div className="relative">
      {/* Botón visible solo cuando el tema es claro */}
      <img
        src={LightButton}
        alt="Light Mode"
        // Cambia entre claro y oscuro
        onClick={toggleTheme}
        className={`w-12 cursor-pointer drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] transition-all duration-300 absolute right-0 z-10 ${
          theme === "dark" ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* Botón visible cuando el tema es oscuro */}
      <img
        src={DarkButton}
        alt="Dark Mode"
        // Cambia entre oscuro y claro
        onClick={toggleTheme}
        className="w-12 cursor-pointer drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] transition-all duration-300"
      />
    </div>
  );
};

export default DarkMode;
