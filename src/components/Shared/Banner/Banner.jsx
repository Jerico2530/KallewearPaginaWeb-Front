/**
 * Banner.jsx
 * -------------------------------------------------
 * Componente visual de alto impacto que muestra descuentos activos en la tienda.
 *
 * Funcionalidades clave:
 * - Consulta y muestra información de descuentos activos mediante el hook useDescuentosActivos.
 * - Formatea fechas de inicio y fin para mejorar la legibilidad.
 * - Presenta información en tarjetas visuales con iconografía y gradientes llamativos.
 * - Implementa animaciones y efectos de transición para mejorar la experiencia de usuario.
 *
 * Propósito:
 * Este componente busca resaltar promociones importantes en la página principal,
 * generando un impacto visual atractivo y guiando al usuario a interactuar con las ofertas.
 */

import React from "react";
import {
  FaCalendarAlt,
  FaPercentage,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { useDescuentosActivos } from "../../../hooks/useDescuento";

const Banner = () => {
  // Hook personalizado para obtener los descuentos activos
  const { data: descuentos, isLoading, isError } = useDescuentosActivos();
  // Se toma el primer descuento activo si existe
  const descuentoActivo = descuentos?.[0] || null;

  // Formateo de fecha de inicio del descuento a formato legible para el usuario
  const fechaInicioFormatted = descuentoActivo?.fechaInicio
    ? new Date(descuentoActivo.fechaInicio).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  // Formateo de fecha de fin del descuento
  const fechaFinFormatted = descuentoActivo?.fechaFin
    ? new Date(descuentoActivo.fechaFin).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <section
      className="relative min-h-[550px] flex justify-center items-center py-16 px-6 
      bg-gradient-to-r from-gray-900 via-black to-gray-800 
      text-white overflow-hidden"
    >
      <div className="container relative z-10">
        {isLoading ? (
          // Estado de carga mientras se obtienen los descuentos
          <p className="text-center text-gray-400">Cargando descuento...</p>
        ) : isError ? (
          // Manejo de error si la API falla
          <p className="text-center text-red-500">
            Error al cargar el descuento.
          </p>
        ) : descuentoActivo ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
            {/* Imagen representativa del descuento */}
            <div data-aos="zoom-in" className="flex justify-center">
              <img
                src={descuentoActivo.imagen}
                alt={`Descuento: ${descuentoActivo.nombre}`}
                className="max-w-[420px] h-[350px] w-full rounded-2xl shadow-2xl object-cover 
                transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Información textual del descuento */}
            <div className="flex flex-col justify-center gap-6 sm:pt-0">
              <h1
                data-aos="fade-up"
                className="text-4xl sm:text-5xl font-extrabold text-white leading-snug drop-shadow-lg"
              >
                {descuentoActivo.nombre}
              </h1>

              <p
                data-aos="fade-up"
                className="text-base sm:text-lg text-gray-300 leading-relaxed"
              >
                {descuentoActivo.descripcion}
              </p>

              {/* Bloque adicional con descripción premium de la oferta */}
              <div
                data-aos="fade-up"
                className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20 
                shadow-xl max-w-xl"
              >
                <p className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
                  🌟 La oferta perfecta para renovar tu estilo.
                </p>

                <p className="text-gray-300 mt-1 text-sm sm:text-base leading-relaxed">
                  Esta promoción fue creada para que aproveches productos
                  seleccionados con precios irresistibles. Calidad, tendencia y
                  ahorro… todo en un solo lugar.
                </p>
              </div>

              {/* Tarjetas informativas sobre el descuento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                {/* Tarjeta de porcentaje de descuento */}
                <div
                  data-aos="fade-up"
                  className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-violet-700 
                  p-4 rounded-xl shadow-md hover:scale-105 transition-transform"
                >
                  <FaPercentage className="text-2xl text-white" />
                  <p className="text-white font-semibold">
                    {descuentoActivo.porcentaje}% OFF
                  </p>
                </div>

                {/* Fecha inicio */}
                {fechaInicioFormatted && (
                  <div
                    data-aos="fade-up"
                    className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 
                    p-4 rounded-xl shadow-md hover:scale-105 transition-transform"
                  >
                    <FaCalendarAlt className="text-2xl text-white" />
                    <p className="text-white font-semibold">
                      Desde {fechaInicioFormatted}
                    </p>
                  </div>
                )}

                {/* Tarjeta de fecha de fin, solo si existe */}
                {fechaFinFormatted && (
                  <div
                    data-aos="fade-up"
                    className="flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-amber-600 
                    p-4 rounded-xl shadow-md hover:scale-105 transition-transform"
                  >
                    <FaClock className="text-2xl text-white" />
                    <p className="text-white font-semibold">
                      Hasta {fechaFinFormatted}
                    </p>
                  </div>
                )}

                {/* Tarjeta que indica disponibilidad activa de la oferta */}
                <div
                  data-aos="fade-up"
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 
                  p-4 rounded-xl shadow-md hover:scale-105 transition-transform"
                >
                  <FaCheckCircle className="text-2xl text-white" />
                  <p className="text-white font-semibold">
                    Oferta activa y disponible
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Estado cuando no hay descuentos activos
          <p className="text-center text-gray-400">
            No hay descuentos activos actualmente.
          </p>
        )}
      </div>

      {/* Efecto visual de fondo tipo glow para dar sensación urbana */}
      <div
        className="absolute top-0 left-0 w-full h-full 
        bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.2),transparent)] 
        pointer-events-none"
      ></div>
    </section>
  );
};

export default Banner;
