/**
 * NoticiasPage.jsx
 *
 * Descripción del proyecto:
 * Página de Noticias de Kallewear, destinada a mantener informados a los clientes sobre novedades,
 * promociones y comunicados importantes de la empresa.
 *
 * Funcionalidades clave:
 * 1. Obtiene dinámicamente las noticias desde la API utilizando el hook useNoticias.
 * 2. Maneja estados de carga y error de manera clara para mejorar la experiencia del usuario.
 * 3. Ordena las noticias por fecha de publicación, mostrando primero las más recientes.
 * 4. Tarjetas visualmente atractivas adaptadas a modo claro y oscuro con animaciones y hover effects.
 *
 * Propósito:
 * Informar al cliente de forma accesible y organizada, reforzando la comunicación y transparencia
 * de la marca.
 */
import { useNoticias } from "../../../hooks/useNoticias";

const NoticiasPage = () => {
  const { data: noticias, isLoading, isError } = useNoticias();

  return (
    // 🔹 Contenedor principal: fondo claro en light, gris oscuro en dark, texto blanco por defecto en dark
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white flex flex-col">
      {/* 🔹 Ajusté el padding-top para que el título esté más abajo */}
      <main className="flex-grow max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-40 pb-20">
        {/* Título principal */}
        <div className="text-center mb-16">
          {/* 🔹 No hace falta cambiar nada aquí, el espacio viene del padding-top del main */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Noticias de la Empresa
          </h1>
          <div className="w-24 h-1 bg-gray-900 dark:bg-white mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Estado de carga y error */}
        {isLoading ? (
          <p className="text-center text-gray-500 dark:text-gray-300 animate-pulse">
            Cargando noticias...
          </p>
        ) : isError ? (
          <p className="text-center text-red-500 dark:text-red-400 font-semibold">
            Error al cargar las noticias.
          </p>
        ) : (
          // Contenedor de tarjetas de noticias
          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {noticias &&
              [...noticias]
                .sort(
                  (a, b) =>
                    new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
                )
                .map((noticia) => (
                  <article
                    key={noticia.noticiaId}
                    // 🔹 Tarjeta: fondo blanco en light, gris oscuro en dark, borde y sombra adaptados
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-700 rounded-2xl overflow-hidden flex flex-col hover:scale-[1.03] hover:shadow-2xl dark:hover:shadow-gray-600 transition-transform duration-300"
                  >
                    {/* Imagen */}
                    <div className="h-64 w-full">
                      <img
                        src={noticia.imagen}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Contenido */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-gray-700 dark:hover:text-gray-300 transition">
                        {noticia.titulo}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 flex-grow line-clamp-3">
                        {noticia.descripcion}
                      </p>
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {new Date(noticia.fechaPublicacion).toLocaleDateString(
                          "es-PE",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </article>
                ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NoticiasPage;
