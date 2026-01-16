/**
 * FrecuentesPage.jsx
 *
 * Descripción del proyecto:
 * Página de Preguntas Frecuentes (FAQ) de Kallewear, integrada en la plataforma de e-commerce.
 *
 * Funcionalidades clave:
 * 1. Mostrar dinámicamente preguntas frecuentes obtenidas desde la API.
 * 2. Permitir expandir y contraer cada respuesta para una mejor experiencia de lectura.
 * 3. Adaptación completa a modo oscuro y claro, con transiciones suaves y animaciones.
 * 4. Banner visual atractivo que contextualiza la sección y mejora la presentación.
 *
 * Propósito:
 * Facilitar al cliente la resolución de dudas comunes, mejorando la transparencia
 * y confianza en la experiencia de compra.
 */
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { usePreguntas } from "../../../hooks/usePregunta";

const FrecuentesPage = () => {
  const [abierta, setAbierta] = useState(null);
  const { data: preguntas, isLoading, isError } = usePreguntas();

  // Alterna la visualización de la respuesta de la pregunta seleccionada
  const togglePregunta = (preguntaId) => {
    setAbierta(abierta === preguntaId ? null : preguntaId);
  };

  // Manejo de estado de carga
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 dark:text-gray-300">
        Cargando preguntas...
      </div>
    );
  }

  // Manejo de errores al cargar las preguntas
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 dark:text-red-400">
        Ocurrió un error al cargar las preguntas.
      </div>
    );
  }

  return (
    //  Contenedor principal: fondo claro en light, gris oscuro en dark, texto blanco por defecto en dark
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      {/* Hero Banner */}
      <div className="relative w-full h-64 bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1604014237744-9d39f1eb6ef2?q=80&w=1600&auto=format&fit=crop"
          alt="Banner preguntas frecuentes"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Contenido */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Preguntas Frecuentes
        </h1>

        <div className="space-y-5">
          {preguntas.map((item) => (
            <div
              key={item.preguntaId}
              // 🔹 Tarjeta: fondo blanco en light, gris oscuro en dark, sombra adaptada
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-700 overflow-hidden transition hover:shadow-lg dark:hover:shadow-gray-600"
            >
              <button
                onClick={() => togglePregunta(item.preguntaId)}
                // Botón: fondo gris claro en light, más oscuro en dark, hover adaptado
                className="w-full flex justify-between items-center p-5 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200 transition text-left"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.preguntas}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {abierta === item.preguntaId ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </span>
              </button>

              {/* Respuesta desplegable */}
              {abierta === item.preguntaId && (
                <div className="p-5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-600 animate-fade-in">
                  {item.respuesta}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FrecuentesPage;
