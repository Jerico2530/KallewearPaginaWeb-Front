/**
 * SizeFilter.jsx
 * ---------------------------------------------------------------------
 * Componente de filtrado de productos por talla.
 *
 * Propósito del componente:
 * - Mostrar únicamente las tallas disponibles según los productos visibles.
 * - Permitir al usuario filtrar productos en tiempo real mediante selección
 *   de una talla específica.
 * - Proveer una experiencia fluida mostrando una barra de carga mientras
 *   se aplica el filtro.
 *
 * Funcionalidades clave:
 * - Obtiene dinámicamente las tallas únicas desde los datos ya cargados.
 * - Permite seleccionar y deseleccionar la talla (toggling).
 * - Sincroniza la acción del usuario con un store global (estado centralizado).
 *
 */

import { useMemo, useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import useSizeFilterStore from "../../../store/sizeFilterStore";

const SizeFilter = ({ products, totalFiltered }) => {
  // Referencia para controlar la barra de carga superior
  const ref = useRef(null);
  // Estado global: tallas seleccionadas y acción para filtrar
  const { selectedSizes, handleFilter } = useSizeFilterStore();

  // Cálculo de tallas únicas según los productos actualmente visibles
  const sizes = useMemo(() => {
    if (!products || products.length === 0) return [];

    // Extrae todas las tallas disponibles desde tallasDetalle
    const allSizes = products.flatMap((product) =>
      product.tallasDetalle.map((t) => t.tipoTalla)
    );

    // Elimina duplicados y ordena
    return [...new Set(allSizes)].sort();
  }, [products]);

  // Maneja selección/des-selección de la talla y activa animación de carga
  const handleSizeClick = (size) => {
    ref.current.continuousStart();

    const newSizes =
      selectedSizes.length === 1 && selectedSizes[0] === size
        ? [] // Si la talla ya estaba seleccionada, se limpia el filtro
        : [size]; // Caso contrario, se selecciona la nueva talla

    // Se retrasa para que la barra de carga se perciba mejor
    setTimeout(() => {
      handleFilter(newSizes, ref);
    }, 100);
  };

  return (
    // 🔹 Contenedor principal: light mode blanco, dark mode gris oscuro
    <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-2xl p-5">
      {/* Barra de carga controlada por ref */}
      <LoadingBar color="#f97316" ref={ref} shadow={true} />

      {/* Encabezado del filtro con título y contador de resultados */}
      <div className="flex items-center justify-between mb-4">
        {/* 🔹 Título: texto cambia a blanco en dark */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Filtrar por talla
        </h2>
        {/* 🔹 Contador de productos: texto cambia a gris claro en dark */}
        <span className="text-sm text-gray-500 dark:text-gray-300">
          {totalFiltered} productos
        </span>
      </div>

      {/* Botones de tallas */}
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => handleSizeClick(size)}
            aria-pressed={selectedSizes.includes(size)}
            className={`w-12 h-12 flex items-center justify-center rounded-full font-medium text-sm transition-all duration-300 shadow-sm
              ${
                selectedSizes.includes(size)
                  ? "bg-gray-900 text-white shadow-md scale-105 dark:bg-gray-100 dark:text-gray-900 dark:shadow-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border dark:hover:bg-gray-600"
              }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeFilter;
