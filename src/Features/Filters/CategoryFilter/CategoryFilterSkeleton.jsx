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
          {/* Placeholder del área de imagen del producto */}
          <div className="skeleton image-skeleton">
            <div className="skeleton shipping-badge"></div>
          </div>
          {/* Placeholder del contenido textual y acciones */}
          <div className="card-body">
            <div className="skeleton title-skeleton-card"></div>
            {/* Sección del precio e información de pago */}
            <div className="price-row">
              <div className="skeleton price-skeleton"></div>
              <div className="skeleton installment-skeleton"></div>
            </div>
            {/* Simulación de categorías dentro de la card */}
            <div className="sizes-skeleton">{renderCategoryCircles(4)}</div>
            {/* Simulación del botón de acción del producto */}
            <div className="skeleton button-skeleton"></div>
          </div>
        </div>
      </div>
    ));

  return (
    <div className="page-container">
      {/* Encabezado del área de selección de categorías en estado de carga */}
      <div className="category-selector">
        <div className="category-title">
          <div className="skeleton title-skeleton"></div>
          <div className="skeleton count-skeleton"></div>
        </div>
        {/* Grid placeholder de categorías */}
        <div className="category-grid">{renderCategoryCircles(5)}</div>
      </div>
      {/* Grid placeholder de productos */}
      <div className="product-grid">
        <div className="row g-4">{renderCards(4)}</div>
      </div>
    </div>
  );
};
