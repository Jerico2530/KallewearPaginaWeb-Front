/**
 * TallaPage.jsx
 *
 *
 * Funcionalidades clave:
 * 1. Visualización de tallas por género y tipo de prenda (polos, pantalones, chompas).
 * 2. Cambio de género mediante tabs con animación fluida.
 * 3. Animaciones de entrada/salida usando Framer Motion para mejorar la experiencia de usuario.
 * 4. Tablas responsivas con scroll horizontal y estilo adaptado a light/dark mode.
 *
 * Propósito:
 * Proveer información clara y confiable de las medidas de cada prenda,
 * facilitando la elección correcta de tallas para los clientes.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TallaPage = () => {
  // Estado para seleccionar género activo
  const [genero, setGenero] = useState("hombre");

  const tallas = {
    hombre: {
      polos: [
        { id: 1, talla: "S", pecho: "90-95 cm", largo: "65-68 cm" },
        { id: 2, talla: "M", pecho: "96-100 cm", largo: "69-72 cm" },
        { id: 3, talla: "L", pecho: "101-106 cm", largo: "73-75 cm" },
        { id: 4, talla: "XL", pecho: "107-113 cm", largo: "76-78 cm" },
      ],
      pantalones: [
        { id: 1, talla: "28", cintura: "71-74 cm", largo: "98 cm" },
        { id: 2, talla: "30", cintura: "75-78 cm", largo: "100 cm" },
        { id: 3, talla: "32", cintura: "79-82 cm", largo: "102 cm" },
      ],
      chompas: [
        { id: 1, talla: "S", pecho: "90-95 cm", largo: "65 cm" },
        { id: 2, talla: "M", pecho: "96-100 cm", largo: "68 cm" },
        { id: 3, talla: "L", pecho: "101-106 cm", largo: "70 cm" },
      ],
    },
    mujer: {
      polos: [
        { id: 1, talla: "S", pecho: "80-85 cm", largo: "60-63 cm" },
        { id: 2, talla: "M", pecho: "86-90 cm", largo: "64-66 cm" },
        { id: 3, talla: "L", pecho: "91-96 cm", largo: "67-69 cm" },
      ],
      pantalones: [
        { id: 1, talla: "26", cintura: "65-68 cm", largo: "95 cm" },
        { id: 2, talla: "28", cintura: "69-72 cm", largo: "97 cm" },
        { id: 3, talla: "30", cintura: "73-76 cm", largo: "99 cm" },
      ],
      chompas: [
        { id: 1, talla: "S", pecho: "80-85 cm", largo: "62 cm" },
        { id: 2, talla: "M", pecho: "86-90 cm", largo: "64 cm" },
        { id: 3, talla: "L", pecho: "91-96 cm", largo: "66 cm" },
      ],
    },
  };
  // Función para renderizar tabla de una prenda específica
  const renderTabla = (prenda, datos) => (
    <div key={prenda} className="mb-12">
      <h3 className="text-2xl font-bold mb-4 capitalize text-gray-900 dark:text-white">
        {prenda}
      </h3>
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700 text-left text-sm">
          <thead className="bg-gradient-to-r from-primary to-secondary text-white uppercase">
            <tr>
              {Object.keys(datos[0])
                .filter((k) => k !== "id")
                .map((key) => (
                  <th key={key} className="px-4 py-3 border">
                    {key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {datos.map((fila) => (
              <tr
                key={fila.id}
                className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
              >
                {Object.entries(fila)
                  .filter(([k]) => k !== "id")
                  .map(([k, val]) => (
                    <td key={k} className="px-4 py-3 border">
                      {val}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pt-40 pb-16">
      {/* Título principal */}
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Guía de Tallas - Ropa Urbana
      </h1>

      {/* Tabs de género */}
      <div className="flex justify-center gap-4 mb-12">
        {["hombre", "mujer"].map((g) => (
          <button
            key={g}
            onClick={() => setGenero(g)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-xl ${
              genero === g
                ? "bg-gradient-to-r from-primary to-secondary text-white scale-105"
                : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            }`}
          >
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </button>
        ))}
      </div>

      {/* Tablas animadas con cambio de género */}
      <AnimatePresence mode="wait">
        <motion.div
          key={genero}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-10"
        >
          {Object.entries(tallas[genero]).map(([prenda, datos]) =>
            renderTabla(prenda, datos)
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TallaPage;
