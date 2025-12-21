/**
 * Botón genérico y reutilizable para acciones rápidas en UI,
 * optimizado para temas claro/oscuro y tamaños responsivos.
 * Permite personalizar icono, color y dimensiones de forma flexible.
 */

import React from "react";

const IconButton = ({
  icon, // Elemento visual a renderizar dentro del botón
  color = "bg-gray-500", // color modo claro
  darkColor = "dark:bg-gray-600", // color modo oscuro
  size = 10, // Tamaño base del botón (h y w)
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        ${color} ${darkColor} text-white 
        rounded 
        flex items-center justify-center 
        transition transform hover:scale-110 
        ${className}
        h-${size} w-${size}          /* tamaño base */
        sm:h-${Math.floor(size * 0.8)} sm:w-${Math.floor(
        size * 0.8
      )}  /* pequeño */
        md:h-${size} md:w-${size}  /* mediano */
      `}
    >
      {/* Render dinámico del ícono */}
      {icon}
    </button>
  );
};

export default IconButton;
