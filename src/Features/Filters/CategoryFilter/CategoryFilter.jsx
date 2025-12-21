/**
 *CategoryFilter
 *
 * Descripción general
 * Este proyecto permite a los usuarios explorar un catálogo de moda dinámico y filtrable,
 * optimizando la experiencia de compra mediante interfaces modernas, rápidas y fáciles de usar.
 *
 * Funcionalidad clave del componente:
 * CategoryFilter administra el filtrado de productos según categorías,
 * permitiendo que el usuario visualice únicamente los items que cumplen con el criterio seleccionado.
 * Ofrece retroalimentación visual del proceso mientras el filtro se aplica,
 * mejorando la usabilidad y reduciendo fricción en la navegación de productos.
 */
import { useMemo, useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import useCategoryFilterStore from "../../../store/categoryFilterStore";

const CategoryFilter = ({ products, totalFiltered }) => {
  // Referencia utilizada para controlar la barra animada de progreso durante el filtrado
  const ref = useRef(null);
  // Estado global del filtro y función que actualiza la categoría seleccionada
  const { selectedCategory, handleFilter } = useCategoryFilterStore();

  // Obtención de categorías únicas derivadas de los productos disponibles
  const categories = useMemo(() => {
    if (!products || products.length === 0) return [];
    // Si un producto no posee categoría definida, se establece un texto por defecto
    const all = products.map((p) => p.categoria || "Sin categoría");
    // Con Set se eliminan repetidos y se retorna un arreglo limpio
    return [...new Set(all)];
  }, [products]);

  // Acción ejecutada cuando el usuario selecciona una categoría
  const handleCategoryClick = (category) => {
    // Visualización de barra de carga mientras se aplica el filtro
    ref.current.continuousStart();
    // Si se selecciona nuevamente la categoría, se limpia el filtro
    const newCategory = selectedCategory === category ? "" : category;

    // Se aplica un pequeño retraso para suavizar la animación
    setTimeout(() => {
      handleFilter(newCategory, ref);
    }, 100);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5">
      {/* Indicador de carga durante las operaciones de filtrado */}
      <LoadingBar color="#f97316" ref={ref} shadow={true} />

      {/* Encabezado: describe el filtro y muestra la cantidad de resultados actuales */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Filtrar por categoría
        </h2>

        <span className="text-sm text-gray-500 dark:text-gray-300">
          {totalFiltered} productos
        </span>
      </div>

      {/* Generación dinámica de botones para cada categoría disponible */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            aria-pressed={selectedCategory === category}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 shadow-sm
            ${
              selectedCategory === category
                ? "bg-gray-900 text-white shadow-md scale-105 dark:bg-gray-100 dark:text-gray-900"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
