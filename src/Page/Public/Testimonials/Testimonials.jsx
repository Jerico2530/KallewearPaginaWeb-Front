/**
 * Testimonials.jsx
 *
 * Funcionalidades clave:
 * 1. Obtiene los testimonios desde el backend usando React Query.
 * 2. Muestra un slider responsivo de testimonios usando react-slick.
 * 3. Adapta estilos a light/dark mode.
 * 4. Incluye elementos visuales destacados: avatar, nombre y texto del testimonio.
 *
 * Propósito:
 * Incrementar la confianza y credibilidad de la marca mostrando experiencias
 * positivas de clientes reales, mejorando la percepción de calidad y satisfacción.
 */
import React from "react";
import Slider from "react-slick";
import { useTestimonios } from "../../../hooks/useTestimonio";
import DataLoader from "../../../components/UI/DataLoader";

const Testimonials = () => {
  // Fetch de testimonios desde el backend
  const { data: testimonios, isLoading, isError } = useTestimonios();

  return (
    <DataLoader
      isLoading={isLoading}
      isError={isError}
      data={testimonios?.length > 0 ? testimonios : null} 
      loader={
        <p className="text-center text-gray-500 dark:text-gray-300">
          Cargando testimonios...
        </p>
      }
      errorComponent={
        <p className="text-center text-red-500 dark:text-red-400">
          Error al cargar testimonios.
        </p>
      }
      fallback={null}
    >
      {(testimoniosRender) => (
        <section className="py-16 dark:bg-gray-900 dark:text-white">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide dark:text-white">
                Lo que dicen nuestros clientes
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 dark:text-white">
                Testimonios
              </h2>
              <p className="text-base text-gray-500 mt-3 dark:text-gray-300">
                ¿Y tú, qué esperas para ser parte de esta experiencia?
              </p>
            </div>

            {/* Slider */}
            <Slider
              dots
              infinite
              arrows={false}
              autoplay
              autoplaySpeed={2500}
              pauseOnHover
              slidesToShow={3}
              responsive={[
                { breakpoint: 1024, settings: { slidesToShow: 2 } },
                { breakpoint: 640, settings: { slidesToShow: 1 } },
              ]}
            >
              {testimoniosRender.map((data) => (
                <div key={data.testimonioId} className="px-4">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-8 text-center relative hover:shadow-lg transition duration-300">
                    {/* Avatar */}
                    <div className="mb-4 flex justify-center">
                      <img
                        src={data.imagen}
                        alt={data.nombreCompleto}
                        className="rounded-full w-24 h-24 object-cover border-4 border-primary shadow"
                      />
                    </div>

                    {/* Texto */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed mb-4">
                      “{data.descripcion}”
                    </p>

                    {/* Nombre */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {data.nombreCompleto}
                    </h3>

                    {/* Comillas decorativas */}
                    <span className="absolute text-7xl text-primary/10 font-serif top-4 right-6 select-none">
                      “
                    </span>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      )}
    </DataLoader>
  );
};

export default Testimonials;
