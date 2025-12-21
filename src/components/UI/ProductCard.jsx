/**
 * ProductCard.jsx
 * -------------------------------------------------
 * Componente de tarjeta de producto para catálogo .
 *
 * Funcionalidades clave:
 * - Muestra imagen, nombre, precio, tallas disponibles y stock.
 * - Permite seleccionar talla y agregar el producto al carrito.
 * - Soporta click en imagen (callback opcional) y estado de envío/promoción.
 *
 * Propósito del componente:
 * Componente reutilizable y accesible para listados de producto en una tienda
 * online; diseñado para integrarse en grids o páginas de producto con lógica
 * de negocio gestionada por el padre.
 *

 */
import React from "react";
import { BsCartPlus } from "react-icons/bs";
import Button from "./Button";

const ProductCard = ({
  producto, // Objeto con datos del producto (imagen, nombre, precio, tallasDetalle, estado)
  tallaSeleccionada, // Talla actualmente seleccionada
  onSelectTalla, // Callback para seleccionar una talla
  onAddToCart, // Callback para agregar al carrito
  onImageClick, // Callback opcional al hacer click en la imagen (recibe productoId)
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Imagen del producto; si se pasa onImageClick, se invoca con el id del producto */}
      <div className="relative overflow-hidden rounded-t-2xl aspect-square">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => onImageClick && onImageClick(producto.productoId)} // 🔹 Click dinámico
        />
        {/* Badge de promoción/beneficio (renderiza solo si producto.estado es tru) */}
        {producto.estado && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow">
            Envío gratis
          </span>
        )}
      </div>

      {/* Info del producto */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white truncate">
          {producto.nombre}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          S/. {producto.precio}
        </p>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-300">Tallas:</p>
          {/* Botones de talla: marcan la talla activa y llaman a onSelectTalla */}
          <div className="flex flex-wrap gap-2 mt-1">
            {producto.tallasDetalle.map((talla) => (
              <button
                key={talla.tallaId}
                onClick={() => onSelectTalla(talla)}
                className={`px-2 py-1 text-xs font-medium rounded-full border transition-colors
                  ${
                    tallaSeleccionada?.tallaId === talla.tallaId
                      ? "bg-gray-900 text-white border-gray-900 dark:bg-gray-100 dark:text-gray-900"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  }
                `}
              >
                {talla.tipoTalla}
              </button>
            ))}
          </div>
        </div>

        {/* Indicador de stock de la talla seleccionada; muestra '-' si no se ha seleccionado */}
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Stock:{" "}
          <span className="font-medium text-gray-800 dark:text-gray-100">
            {tallaSeleccionada ? tallaSeleccionada.stock : "-"}
          </span>
        </p>

        {/* Botón principal: deshabilitado hasta que se seleccione una talla */}
        <Button
          onClick={onAddToCart}
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
