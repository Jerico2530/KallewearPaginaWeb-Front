/**
 * Hero.jsx
 * -------------------------------------------------
 * Componente visual principal de la página que muestra banners promocionales.
 *
 * Funcionalidades clave:
 * - Consulta los anuncios/banners activos mediante el hook useAnuncios.
 * - Ajusta dinámicamente el padding superior según la altura del Navbar.
 * - Presenta un slider moderno con animaciones, efectos de glow y transiciones suaves.
 * - Cada banner incluye título, descripción, imagen e hipervínculo opcional.
 *
 * Propósito:
 * Este componente busca atraer la atención del usuario con contenido destacado,
 * promocionando ofertas o anuncios importantes de manera visual y profesional.
 */

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useAnuncios } from "../../../hooks/useAnuncio";

const Hero = () => {
  // Hook personalizado para obtener banners activos desde la API
  const { data: banners = [], isLoading, error } = useAnuncios();
  // Estado para almacenar la altura del Navbar y aplicar padding dinámico
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Detectar altura del Navbar dinámicamente y actualizar al cambiar el tamaño de ventana
  useEffect(() => {
    const navbar = document.querySelector("#main-navbar");
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }

    // actualizar al cambiar tamaño ventana
    const handleResize = () => {
      if (navbar) setNavbarHeight(navbar.offsetHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Estado de carga mientras se obtienen los banners
  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-500">Cargando banners...</div>
    );
  }

  // Manejo de error si la API falla
  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Error al cargar banners
      </div>
    );
  }

  // Retorna null si no existen banners activos
  if (banners.length === 0) return null;

  return (
    <section
      className="relative w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden"
      style={{ paddingTop: navbarHeight }}
    >
      {/* 🎨 Background moderno con efectos de glow */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-[-200px] right-[-150px] w-[600px] h-[600px]
      bg-blue-500/20 dark:bg-blue-400/10 blur-3xl rounded-full"
        ></div>

        <div
          className="absolute bottom-[-250px] left-[-180px] w-[700px] h-[700px]
      bg-indigo-500/20 dark:bg-indigo-400/10 blur-3xl rounded-full"
        ></div>
      </div>

      <div className="container mx-auto py-20 sm:py-28">
        <Slider
          dots={true} // Indicadores de página
          arrows={false} // Sin flechas
          infinite={true} // Loop infinito
          autoplay={true} // Reproducción automática
          autoplaySpeed={4500} // Tiempo entre slides
          speed={900} // Velocidad de transición
          pauseOnHover={false} // No pausa al pasar el mouse
          pauseOnFocus={true} // Pausa al enfocar slide
        >
          {banners.map((banner, index) => (
            <div key={banner.bannerId ?? index} className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-12 sm:gap-16 px-6 sm:px-0">
                {/* 📝 Bloque de texto con estilo premium */}
                <div className="flex flex-col justify-center gap-6 animate-fadeInpx-6 sm:px-12 lg:px-20max-w-2xl">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
                    {banner.titulo}
                  </h1>

                  <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                    {banner.descripcion}
                  </p>
                  {/* Enlace opcional del banner */}
                  {banner.link && (
                    <a
                      href={banner.link}
                      className="inline-block mt-4 px-6 py-3 text-base sm:text-lg font-medium  bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95"
                    >
                      Más información
                    </a>
                  )}
                </div>

                {/* 🖼 Bloque de imagen con efectos modernos */}
                <div className="flex justify-center sm:justify-end">
                  <div className="relative animate-fadeInUp">
                    <img
                      src={banner.imagen}
                      alt={banner.titulo}
                      className="max-w-full max-h-[550px] object-contain 
                    rounded-2xl shadow-2xl 
                    transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />

                    {/* Glow detrás de la imagen para efecto visual  */}
                    <div
                      className="absolute inset-0 -z-10 blur-2xl 
                  bg-blue-500/10 dark:bg-blue-300/10 rounded-2xl"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Hero;
