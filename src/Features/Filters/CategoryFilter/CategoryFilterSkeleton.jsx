/**
 * CategoryFilterSkeleton
 * ---------------------------------------------------------------------
 * Componente de interfaz destinado a mostrar una vista de carga (skeleton)
 * en la sección de categorías y productos mientras se obtienen datos reales.
 *
 * Objetivo del componente:
 * - Mantener la estructura visual del contenido real durante el tiempo
 *   de espera del fetch, evitando saltos de diseño (layout shift).
 * - Mejorar la percepción de rendimiento y la experiencia del usuario
 *   dentro del catálogo de productos.
 *
 * Funcionalidad clave:
 * - Genera cajas de categorías en modo skeleton.
 * - Genera cards de productos con placeholders detallados (imagen, título, precio, tallas y botón).

 */

export const CategoryFilterSkeleton = () => {
  // Genera un número dinámico de cajas skeleton para las categorías
  const renderCategoryBoxes = (count) =>
    Array.from({ length: count }).map((_, index) => (
      <div key={index} className="skeleton category-box"></div>
    ));
  // Genera un número dinámico de productos skeleton (estructura base de la card)
  const renderCards = (count) =>
    Array.from({ length: count }).map((_, index) => (
      <div key={index} className="col-12 col-sm-6 col-lg-3">
        <div className="card card-skeleton">
          <div className="skeleton image-skeleton">
            <div className="skeleton shipping-badge"></div>
          </div>
          {/* Contenido textual simulado del producto */}
          <div className="card-body">
            <div className="skeleton title-skeleton-card"></div>
            {/* Precio e información complementaria */}
            <div className="price-row">
              <div className="skeleton price-skeleton"></div>
              <div className="skeleton installment-skeleton"></div>
            </div>
            {/* Indicadores de tallas/categorías (vista placeholder) */}
            <div className="sizes-skeleton">
              {/* igual que SizeFilterSkeleton pero categorías */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton category-dot"></div>
              ))}
            </div>
            <div className="skeleton button-skeleton"></div>
          </div>
        </div>
      </div>
    ));

  return (
    <div className="page-container">
      {/* Título de la categoría y contador de resultados en estado de carga */}
      <div className="category-selector">
        <div className="category-title">
          <div className="skeleton title-skeleton"></div>
          <div className="skeleton count-skeleton"></div>
        </div>

        {/* Grid de categorías en skeleton */}
        <div className="category-grid">{renderCategoryBoxes(5)}</div>
      </div>

      {/* Grid de productos en skeleton */}
      <div className="product-grid">
        <div className="row g-4">{renderCards(4)}</div>
      </div>
    </div>
  );
};
