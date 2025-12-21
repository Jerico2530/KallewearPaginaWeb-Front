/**
 * CheckoutProgress.jsx
 *
 * Descripción del proyecto:
 * Este componente forma parte del flujo de checkout de una tienda en línea,
 * mostrando el progreso visual del usuario a través de los pasos del proceso
 * de compra.
 *
 * Funcionalidades clave:
 * 1. Mostrar los pasos del checkout con indicadores numéricos.
 * 2. Resaltar el paso activo y los pasos completados con estilos diferenciados.
 * 3. Conectar los pasos con líneas animadas que reflejan el progreso.
 *
 * Propósito:
 * Mejorar la experiencia de usuario proporcionando una guía visual clara
 * del avance en el flujo de compra.
 */
import React from "react";

const steps = [
  "Iniciar Seccion",
  "Detalle Entrega",
  "Detalle Orden",
  "Detalle Pago",
];

const CheckoutProgress = ({ step }) => {
  return (
    <div className="checkout-progress-container w-full flex justify-center">
      <div className="checkout-progress-inner w-full max-w-2xl px-4 py-6 sm:px-6">
        <div className="relative flex flex-col sm:flex-row items-center w-full">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = step > stepNumber;
            const isActive = step === stepNumber;

            return (
              <div
                key={label}
                className="flex-1 flex flex-col sm:flex-row items-center relative"
              >
                {/* Círculo del paso con estilos según estado */}
                <div
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all duration-500 shadow-xl
                    ${
                      isCompleted
                        ? "bg-gradient-to-r from-blue-900 to-indigo-700 text-white scale-105"
                        : isActive
                        ? "bg-indigo-600 text-white ring-4 ring-indigo-400/40 animate-pulse"
                        : "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                >
                  {stepNumber}
                  {isCompleted && (
                    <span className="absolute -right-2 -top-2 w-5 h-5 flex items-center justify-center bg-indigo-700 text-white text-xs rounded-full shadow-md animate-bounce">
                      ✓
                    </span>
                  )}
                </div>

                {/* 🔹 Texto del paso */}
                <p
                  className={`mt-2 sm:mt-0 sm:ml-3 text-center sm:text-left text-sm font-semibold uppercase tracking-wide transition-colors duration-300
                    ${
                      isCompleted
                        ? "text-indigo-700 dark:text-indigo-400"
                        : isActive
                        ? "text-indigo-500 dark:text-indigo-300"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                  {label}
                </p>

                {/* Conector entre pasos */}
                {index < steps.length - 1 && (
                  <div className="absolute sm:relative sm:flex-1 top-1/2 sm:top-auto sm:ml-3 w-px sm:w-full h-10 sm:h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-900 to-indigo-700 transition-all duration-700 ease-out"
                      style={{
                        width: step > stepNumber ? "100%" : "0%",
                        height: step > stepNumber ? "100%" : "0%",
                      }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckoutProgress;
