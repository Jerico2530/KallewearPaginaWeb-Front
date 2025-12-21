/**
 * useDarkMode.js
 * -------------------------------------------------
 * Hook personalizado para manejar el modo oscuro y claro de la aplicación.
 *
 * Funcionalidades clave:
 * - Detecta el tema guardado en localStorage o establece "light" por defecto.
 * - Aplica dinámicamente la clase "dark" al elemento raíz para permitir estilos globales.
 * - Proporciona una función toggleTheme() para alternar entre modos.
 * - Persiste la preferencia del usuario entre sesiones.
 *
 * Propósito:
 * Este hook mejora la experiencia del usuario permitiendo elegir entre modo claro y oscuro,
 * asegurando consistencia visual en toda la aplicación y un control centralizado del tema.
 */
import { useState, useEffect } from "react";

export const useDarkMode = () => {
  // Estado que almacena el tema actual, inicializado desde localStorage o 'light'
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const element = document.documentElement;
    // Aplica o remueve la clase 'dark' al elemento raíz según el tema actual
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark"); // Guarda la preferencia del usuario
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light"); // Guarda la preferencia del usuario
    }
  }, [theme]);
  // Función para alternar entre tema claro y oscuro
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return { theme, toggleTheme }; // Exponer el tema actual y la función de alternancia
};
