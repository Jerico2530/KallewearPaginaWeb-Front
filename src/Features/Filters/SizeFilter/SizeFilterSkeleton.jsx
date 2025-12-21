/**
 * SizeFilterSkeleton.jsx
 * ---------------------------------------------------------------------
 * Componente visual encargado de representar un estado de carga mediante
 * elementos skeleton mientras los datos reales de tallas y productos
 * son obtenidos desde el servidor.
 *
 * Propósito del componente:
 * - Mantener la estructura UI del filtro y del catálogo durante la carga.
 * - Evitar saltos de diseño al mostrar placeholders que simulen el contenido final.
 *
 * Funcionalidades clave:
 * - Genera dinámicamente placeholders para botones de tallas.
 * - Genera cards skeleton que simulan productos con imagen, título, precio
 *   y áreas de interacción.
 */
const SizeFilterSkeleton = () => {
  // Crea dinámicamente los círculos skeleton que simulan tallas
  const renderSizeCircles = (count) =>
    Array.from({ length: count }).map((_, index) => (
      <div key={index} className="skeleton size-circle"></div>
    ));

  // Crea la estructura skeleton de cards de productos
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
            {/* Simulación de tallas dentro de la card */}
            <div className="sizes-skeleton">{renderSizeCircles(4)}</div>
            {/* Simulación del botón de acción del producto */}
            <div className="skeleton button-skeleton"></div>
          </div>
        </div>
      </div>
    ));

  return (
    <div className="page-container">
      {/* Encabezado del área de selección de tallas en estado de carga */}
      <div className="size-selector">
        <div className="size-title">
          <div className="skeleton title-skeleton"></div>
          <div className="skeleton count-skeleton"></div>
        </div>
        {/* Grid placeholder de tallas */}
        <div className="size-grid">{renderSizeCircles(8)}</div>
      </div>
      {/* Grid placeholder de productos */}
      <div className="product-grid">
        <div className="row g-4">{renderCards(4)}</div>
      </div>
    </div>
  );
};

export default SizeFilterSkeleton;
