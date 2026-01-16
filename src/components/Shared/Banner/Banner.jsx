// Banner.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaPercentage, FaClock, FaCheckCircle } from "react-icons/fa";
import { useDescuentosActivos } from "../../../hooks/useDescuento";
import { formatDate } from "../../../utils/formatDate";
import DataLoader from "../../UI/DataLoader";

const Banner = () => {
  const { data: descuentos, isLoading, isError } = useDescuentosActivos();

  return (
    <DataLoader
      isLoading={isLoading}
      isError={isError}
      data={descuentos?.[0]} 
      fallback={null} 
      loader={null} 
      errorComponent={null} 
    >
      {(descuentoActivo) => {
        const fechaInicioFormatted = formatDate(descuentoActivo.fechaInicio);
        const fechaFinFormatted = formatDate(descuentoActivo.fechaFin);

        return (
          <motion.section
            key={descuentoActivo.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative min-h-[550px] flex justify-center items-center py-16 px-6 bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white overflow-hidden"
          >
            <div className="container relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
                {/* Imagen */}
                <div data-aos="zoom-in" className="flex justify-center">
                  {descuentoActivo.imagen && (
                    <img
                      src={descuentoActivo.imagen}
                      alt={`Descuento: ${descuentoActivo.nombre}`}
                      loading="lazy"
                      className="max-w-[420px] h-[350px] w-full rounded-2xl shadow-2xl object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>

                {/* Información */}
                <div className="flex flex-col justify-center gap-6 sm:pt-0">
                  <h1
                    data-aos="fade-up"
                    className="text-4xl sm:text-5xl font-extrabold leading-snug drop-shadow-lg"
                  >
                    {descuentoActivo.nombre}
                  </h1>
                  <p
                    data-aos="fade-up"
                    className="text-base sm:text-lg text-gray-300 leading-relaxed"
                  >
                    {descuentoActivo.descripcion}
                  </p>

                  <div
                    data-aos="fade-up"
                    className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20 shadow-xl max-w-xl"
                  >
                    <p className="text-lg sm:text-xl font-semibold">
                      🌟 La oferta perfecta para renovar tu estilo.
                    </p>
                    <p className="text-gray-300 mt-1 text-sm sm:text-base">
                      Calidad, tendencia y ahorro… todo en un solo lugar.
                    </p>
                  </div>

                  {/* Tarjetas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                    <InfoCard
                      icon={<FaPercentage />}
                      text={`${descuentoActivo.porcentaje}% OFF`}
                      gradient="from-purple-600 to-violet-700"
                    />
                    {fechaInicioFormatted && (
                      <InfoCard
                        icon={<FaCalendarAlt />}
                        text={`Desde ${fechaInicioFormatted}`}
                        gradient="from-green-500 to-emerald-600"
                      />
                    )}
                    {fechaFinFormatted && (
                      <InfoCard
                        icon={<FaClock />}
                        text={`Hasta ${fechaFinFormatted}`}
                        gradient="from-yellow-500 to-amber-600"
                      />
                    )}
                    <InfoCard
                      icon={<FaCheckCircle />}
                      text="Oferta activa y disponible"
                      gradient="from-blue-600 to-indigo-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Glow */}
            <div
              className="absolute top-0 left-0 w-full h-full 
              bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.2),transparent)] 
              pointer-events-none"
            />
          </motion.section>
        );
      }}
    </DataLoader>
  );
};

const InfoCard = ({ icon, text, gradient }) => (
  <motion.div
    data-aos="fade-up"
    className={`flex items-center gap-3 bg-gradient-to-r ${gradient} p-4 rounded-xl shadow-md hover:scale-105 transition-transform`}
  >
    <span className="text-2xl">{icon}</span>
    <p className="font-semibold">{text}</p>
  </motion.div>
);

export default Banner;
