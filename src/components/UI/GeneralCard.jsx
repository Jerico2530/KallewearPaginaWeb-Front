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
  onViewDetail,
  compact = false, // Controla el tamaño según el contexto (Swiper o grid)
}) => {
  return (
    <div
      className={`${
        compact ? "max-w-[280px] h-[400px]" : "max-w-[320px] h-[440px]"
      } w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300
      flex flex-col overflow-hidden`}
    >
      {/* ================= IMAGEN ================= */}
      <div
        className={`relative ${compact ? "h-44" : "h-52"}
        flex items-center justify-center bg-gray-100 dark:bg-gray-700
        cursor-pointer`}
        onClick={onViewDetail} // ✅ MISMA FUNCIÓN
      >
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="h-40 object-contain drop-shadow-md"
        />
      </div>

      {/* ================= INFO ================= */}
      <div className="p-4 flex flex-col flex-1 text-center">
        {/* ⭐ Rating */}
        <div className="flex justify-center gap-1 text-yellow-400 mb-2">
          {[...Array(4)].map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>

        {/* 🏷 Nombre */}
        <h2
          className="text-base font-semibold text-gray-900 dark:text-white
          line-clamp-2 min-h-[48px] mb-2"
        >
          {producto.nombre}
        </h2>

        {/* 💰 Precio */}
        <p className="text-primary font-bold text-lg mb-4">
          S/ {producto.precio?.toFixed(2)}
        </p>

        {/* ================= CTA ================= */}
        <Button
          onClick={onViewDetail} 
          className="w-full mt-auto"
        >
          Ver producto
        </Button>

      </div>
    </div>
  );
};

export default GeneralCard;
