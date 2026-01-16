import { useMemo, useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import useCategoryFilterStore from "../../../store/categoryFilterStore";

const CategoryFilter = ({ products, totalFiltered }) => {
  const ref = useRef(null);
  const { selectedCategories, handleFilter } = useCategoryFilterStore();

  const categories = useMemo(() => {
    if (!products || products.length === 0) return [];
    const all = products.map((p) => p.categoria || "Sin categoría");
    return [...new Set(all)];
  }, [products]);

  const handleCategoryClick = (category) => {
    ref.current.continuousStart();

    // Si ya está seleccionado, lo quitamos; si no, lo añadimos
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setTimeout(() => {
      handleFilter(newCategories, ref);
    }, 100);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5">
      <LoadingBar color="#f97316" ref={ref} shadow={true} />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Filtrar por categoría
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          {totalFiltered} productos
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            aria-pressed={selectedCategories.includes(category)}
            className={`inline-flex items-center justify-center rounded-full 
              px-4 py-2 font-medium text-sm transition-all duration-300 shadow-sm
              ${
                selectedCategories.includes(category)
                  ? "bg-gray-900 text-white shadow-md scale-105 dark:bg-gray-100 dark:text-gray-900 dark:shadow-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border dark:hover:bg-gray-600"
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
