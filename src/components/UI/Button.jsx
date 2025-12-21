/**
 * Button.jsx
 * -------------------------------------------------
 * Componente reutilizable de botón con soporte para diferentes variantes, tamaños y estados.
 *
 * Funcionalidades clave:
 * - Permite personalizar la apariencia mediante variantes (primary, secondary, danger).
 * - Soporta distintos tamaños (sm, md, lg) para adaptarse al diseño responsive.
 * - Permite pasar íconos como elementos hijos para enriquecer la interfaz.
 * - Maneja estados de deshabilitado y aplica estilos visuales para accesibilidad.
 *
 * Propósito:
 * Este componente estandariza los botones en toda la aplicación, asegurando coherencia visual
 * y facilitando el mantenimiento. Ideal para un proyecto empresarial o portafolio profesional.
 */

import React from "react";
import { cn } from "../../utils/cn";

const Button = ({
  children,
  onClick,
  variant = "primary", // Determina la apariencia visual del botón
  size = "md", // Determina el tamaño del botón
  className = "", // Clases adicionales personalizadas
  icon: Icon, // Permite renderizar un ícono al lado del texto
  disabled = false, // Controla si el botón está deshabilitado
  type = "button", // Tipo de botón (button, submit, reset)
}) => {
  // Estilos base compartidos por todas las variantes
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none";
  // Definición de variantes visuales
  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 hover:scale-105",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  // Definición de tamaños
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className
      )}
    >
      {children}
      {/* Renderiza un ícono si se pasa como prop */}
      {Icon && <Icon className="ml-2 text-lg" />}
    </button>
  );
};

export default Button;
