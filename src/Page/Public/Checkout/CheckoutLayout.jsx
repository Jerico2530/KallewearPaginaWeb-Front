// ✅ src/components/Cart/CheckoutLayout.jsx
import React from "react";
import CheckoutProgress from "./CheckoutProgress";

/**
 * Layout escalable para todas las páginas del flujo de compra.
 * - Permite contenido amplio (hasta full width si se necesita).
 * - No limita el scroll, incluso con listas largas.
 * - Mantiene el CheckoutProgress visible y centrado.
 * - Compatible con temas (dark/light) y animaciones suaves.
 */
const CheckoutLayout = ({ step, children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 🧭 Espacio superior para navbar fijo */}
      <div className="h-[80px] md:h-[180px]" />

      {/* 🔹 Progreso de checkout */}
      <div className="w-full flex justify-center mb-8 px-4">
        <div className="max-w-5xl w-full">
          <CheckoutProgress step={step} />
        </div>
      </div>

      {/* 🔹 Contenido principal flexible */}
      <main
        className="w-full max-w-7xl px-4 sm:px-6 md:px-10 
        flex-1 overflow-visible"
      >
        {children}
      </main>

      {/* 🔹 Margen inferior para respiración visual */}
      <div className="h-16" />
    </div>
  );
};

export default CheckoutLayout;
