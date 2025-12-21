/**
 * GeneralCard
 * Componente de tarjeta de producto reutilizable para mostrar información comercial
 * con imagen, precio, calificación visual y acción para agregar al carrito.
 * Compatible con diferentes tamaños de presentación (catálogo o carrusel).
 * 
 * Funcionalidades clave:
 * - Muestra imagen, nombre, calificación visual y precio del producto.
 * - Diseño adaptable: versión compacta para sliders y versión regular para grillas.
 * - Incluye interacción directa mediante un botón que comunica acciones al componente padre.
 * 
 * Propósito del componente:
 * Representar visualmente un producto dentro del catálogo de una tienda virtual
 * permitiendo al usuario visualizar su información principal y agregarlo al carrito.
 
 */

import React from "react";
import { FaStar } from "react-icons/fa";
import { BsCartPlus } from "react-icons/bs";
import Button from "./Button";

const GeneralCard = ({
  producto, // Datos del producto a mostrar
  onAddToCart, // Acción principal: agregar al carrito
  compact = false, // Controla el tamaño según el contexto (Swiper o grid)
}) => {
  return (
    // Tarjeta interactiva con animaciones y diseño responsivo
    <div
      className={`${
        compact
          ? "max-w-[280px] h-[400px]" // 🔹 tamaño fijo para Swiper
          : "max-w-[320px] h-[440px]" // 🔹 tamaño fijo para grid o catálogo
      } w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md 
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
      flex flex-col justify-between overflow-hidden`}
    >
      {/* Sección de imagen */}
      <div
        className={`relative ${
          compact ? "h-44" : "h-52"
        } flex items-center justify-center bg-gray-100 dark:bg-gray-700 overflow-hidden`}
      >
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="h-40 object-contain transform group-hover:scale-110 duration-300 drop-shadow-md"
        />
      </div>

      {/* Información del producto */}
      <div className="p-4 flex flex-col justify-between flex-1 text-center">
        {/* Texto principal */}
        <div className="flex flex-col gap-2 flex-grow">
          {/* Estrellas demostrativas */}
          <div className="flex justify-center gap-1 text-yellow-400">
            {[...Array(4)].map((_, i) => (
              <FaStar key={i} className="animate-pulse" />
            ))}
          </div>

          {/* Nombre del producto */}
          <h2 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[48px]">
            {/* 🔹 2 líneas exactas para mantener altura */}
            {producto.nombre}
          </h2>

          {/* Precio */}
          <p className="text-primary font-bold text-lg">
            S/ {producto.precio?.toFixed(2)}
          </p>
        </div>

        {/* Botón */}
        <div className="mt-4">
          <Button
            onClick={() => onAddToCart(producto)}
            icon={BsCartPlus}
            className="w-full"
          >
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneralCard;
