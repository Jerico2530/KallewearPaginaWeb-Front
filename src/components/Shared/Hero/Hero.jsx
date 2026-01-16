import React, { useRef } from "react";
import Slider from "react-slick";
import { useAnuncios } from "../../../hooks/useAnuncio";
import { useNavbarHeight } from "../../../utils/useNavbarHeight";
import { heroSliderSettings } from "../../../utils/heroSliderSettings";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=Imagen+no+disponible";

const HERO_NAVBAR_OFFSET = 32;

const Hero = () => {
  const navbarRef = useRef(null);
  const navbarHeight = useNavbarHeight(navbarRef);
  const heroPaddingTop = navbarHeight + HERO_NAVBAR_OFFSET;

  const { data: banners = [], isLoading, error } = useAnuncios();

  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-500">Cargando banners...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Error al cargar banners
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <>
      {/* Navbar referencia */}
      <div ref={navbarRef} id="main-navbar" />

      <section
        className="relative w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden"
        style={{ paddingTop: heroPaddingTop }}
      >
        {/* Glow background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-200px] right-[-150px] w-[600px] h-[600px] bg-blue-500/20 dark:bg-blue-400/10 blur-3xl rounded-full" />
          <div className="absolute bottom-[-250px] left-[-180px] w-[700px] h-[700px] bg-indigo-500/20 dark:bg-indigo-400/10 blur-3xl rounded-full" />
        </div>

        <div className="container mx-auto py-20 sm:py-28">
          <Slider {...heroSliderSettings}>
            {banners.map((banner, index) => {
              const bannerKey = banner.bannerId ?? `banner-${index}`;

              return (
                <div key={bannerKey} className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-12 px-6 sm:px-0">
                    {/* Texto */}
                    <div className="flex flex-col gap-6 sm:px-12 lg:px-20 max-w-2xl">
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
                        {banner.titulo}
                      </h1>

                      <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
                        {banner.descripcion}
                      </p>

                      {banner.link && (
                        <a
                          href={banner.link}
                          className="inline-block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition"
                        >
                          Más información
                        </a>
                      )}
                    </div>

                    {/* Imagen */}
                    <div className="flex justify-center sm:justify-end">
                      <img
                        src={banner.imagen || FALLBACK_IMAGE}
                        alt={banner.titulo}
                        loading="lazy"
                        onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                        className="max-w-full max-h-[550px] object-contain rounded-2xl shadow-2xl"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </section>
    </>
  );
};

export default Hero;
