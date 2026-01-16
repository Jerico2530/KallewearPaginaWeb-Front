import React, { useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Button from "./Button";

const ProductCard = ({
  producto,
  tallaSeleccionada,
  onSelectTalla,
  onAddToCart,
  onImageClick,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "100px",
  });

  const blurStyle = {
    filter: "blur(15px)",
    transform: "scale(1.05)",
    transition: "opacity 0.5s ease-out",
  };

  const handleToggleTalla = (talla) => {
    const isActive = tallaSeleccionada?.tallaId === talla.tallaId;
    onSelectTalla(isActive ? null : talla);
  };

  const handleAddToCart = () => {
    if (!tallaSeleccionada) return;
    onAddToCart(producto, tallaSeleccionada);
  };

  return (
    <div
      ref={ref}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      {/* Imagen */}
      <div className="relative overflow-hidden rounded-t-2xl aspect-square">
        <Link to={`/producto/${producto.tallasDetalle[0].productoTallaId}`}>
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}

          {inView && (
            <>
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className={`w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer
                  ${
                    imageLoaded
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                onLoad={() => setImageLoaded(true)}
                onClick={onImageClick}
              />

              {!imageLoaded && (
                <img
                  src={producto.imagen}
                  alt="placeholder"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={blurStyle}
                />
              )}
            </>
          )}
        </Link>

        {producto.estado && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow">
            Envío gratis
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-semibold text-lg truncate">
          {producto.nombre}
        </h3>

        <p className="text-sm">S/. {producto.precio}</p>

        {/* Tallas */}
        <div>
          <p className="text-sm text-gray-500">Tallas:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {producto.tallasDetalle.map((talla) => {
              const activa =
                tallaSeleccionada?.tallaId === talla.tallaId;

              return (
                <button
                  key={talla.tallaId}
                  onClick={() => handleToggleTalla(talla)}
                  className={`px-2 py-1 text-xs font-medium rounded-full border transition-colors
                    ${
                      activa
                        ? "bg-gray-900 text-white border-gray-900 dark:bg-gray-100 dark:text-gray-900"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    }`}
                >
                  {talla.tipoTalla}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stock */}
        <p className="text-sm text-gray-500">
          Stock:{" "}
          <span className="font-medium">
            {tallaSeleccionada ? tallaSeleccionada.stock : "-"}
          </span>
        </p>

        {/* Botón */}
        <Button
          onClick={handleAddToCart}
          disabled={!tallaSeleccionada}
          icon={BsCartPlus}
          className="mt-auto w-full"
        >
          Agregar al carrito
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
