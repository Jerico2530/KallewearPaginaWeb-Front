import React from "react";

/**
 * LayoutContainer
 * --------------------------------------------------
 * Contenedor universal para páginas internas
 * - Respeta Navbar fijo
 * - Respeta PageCrud (sidebar)
 * - Evita desbordes
 * - Centra contenido
 * - Scroll controlado
 */
const LayoutContainer = ({
  children,
  maxWidth = "1400px",
  className = "",
}) => {
  return (
    <div
      className={`
        w-full
        min-h-[calc(100vh-120px)]
        pt-6
        pb-8
        px-4 sm:px-6
        flex justify-center
        ${className}
      `}
    >
      <div
        className="w-full"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
};

export default LayoutContainer;
