/**
 * NuestraPage.jsx
 *
 * Descripción del proyecto:
 * Página "Nuestra Historia" de Kallewear, destinada a mostrar la evolución de la marca
 * y conectar emocionalmente con los clientes a través de la narrativa de la empresa.
 *
 * Funcionalidades clave:
 * 1. Obtiene dinámicamente la historia de la marca desde la API mediante el hook useHistorias.
 * 2. Muestra un banner introductorio con imagen y descripción resumida del origen de la marca.
 * 3. Visualiza la línea de tiempo de eventos históricos de forma alternada y responsiva.
 * 4. Maneja estados de carga y error para garantizar una experiencia de usuario clara y consistente.
 * 5. Estilo adaptativo a modo claro y oscuro con animaciones y efectos hover en tarjetas.
 *
 * Propósito:
 * Comunicar la identidad y evolución de la marca de manera visual, profesional y atractiva para el cliente,
 */

import footerLogo from "../../../assets/logo.png";
import { useHistorias } from "../../../hooks/useHistoria";

const NuestraPage = () => {
  const { data: historias, isLoading, isError } = useHistorias();

  return (
    //  Contenedor principal: fondo claro en light y gris oscuro en dark, texto blanco en dark
    <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-gray-900 dark:text-white">
      <main className="flex-grow max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-40 pb-20">
        {/* Título principal */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Nuestra Historia
          </h1>
          {/* 🔹 Línea decorativa: color cambia en dark */}
          <div className="w-24 h-1 bg-gray-900 dark:bg-white mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Introducción con imagen */}
        <div className="flex flex-col md:flex-row gap-10 items-center mb-20">
          <img
            src={footerLogo}
            alt="Orígenes de la marca"
            className="w-full md:w-1/2 rounded-2xl shadow-xl object-cover h-72"
          />
          <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed md:w-1/2">
            Nuestra marca nació en las calles de Lima, inspirada en la cultura
            urbana, la música, el arte callejero y la actitud de una nueva
            generación que busca vestir con identidad propia. Desde nuestros
            inicios, nos propusimos crear más que prendas: queremos contar
            historias a través de cada diseño.
          </p>
        </div>

        {/* Línea de tiempo alternada */}
        {isLoading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 animate-pulse">
            Cargando historia...
          </p>
        ) : isError ? (
          <p className="text-center text-red-500 font-semibold">
            Error al cargar la historia.
          </p>
        ) : (
          <div className="relative">
            {/* Línea central */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 bg-gray-300 dark:bg-gray-700 h-full"></div>

            <div className="space-y-16">
              {historias &&
                historias.map((evento, index) => (
                  <div
                    key={evento.historiaId}
                    className={`relative flex flex-col md:flex-row items-center ${
                      index % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Punto central */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-900 dark:bg-white rounded-full border-4 border-white shadow-md z-10"></div>

                    {/* Tarjeta */}
                    <div
                      className={`bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700 rounded-2xl p-6 w-full md:w-5/12 transition hover:shadow-xl dark:hover:shadow-gray-600 ${
                        index % 2 === 0
                          ? "md:ml-auto md:text-left"
                          : "md:mr-auto md:text-right"
                      }`}
                    >
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {new Date(evento.año).getFullYear()} — {evento.titulo}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {evento.descripcion}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NuestraPage;
