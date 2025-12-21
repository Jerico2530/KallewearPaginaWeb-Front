/**
 * TopProducts.jsx
 *
 * Funcionalidades clave:
 * 1. Obtiene los productos desde el backend usando React Query.
 * 2. Selecciona aleatoriamente productos destacados y actualiza cada 10 segundos.
 * 3. Permite agregar productos al carrito, actualizando cantidades si ya existen.
 * 4. Utiliza Swiper para mostrar un slider responsivo.
 * 5. Integra visualización adaptada a dark/light mode.
 *
 * Propósito:
 * Resaltar productos estratégicos para incentivar la compra, mejorar la interacción del usuario
 * y generar una experiencia dinámica en la tienda online.
 */
import React, { useState, useEffect } from "react";
import GeneralCard from "../../../components/UI/GeneralCard";
import { useProductos } from "../../../hooks/useProducto";
import {
  useCrearCarritoCompras,
  useActualizarCarritoCompras,
  useCarritoCompras,
} from "../../../hooks/useCarrito";

import useOffcanvasStore from "../../../store/offcanvasStore";
import useBalanceStore from "../../../store/balanceStore";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// 🔹 Selección de productos aleatorios
const seleccionarProductosAleatorios = (productos, cantidad) => {
  const barajado = [...productos].sort(() => 0.5 - Math.random());
  return barajado.slice(0, cantidad);
};

const TopProducts = ({ usuarioId = 1 }) => {
  const { data: productos, isLoading, isError } = useProductos();
  const { data: carritoApi = [] } = useCarritoCompras();

  const { mutateAsync: crearCarrito } = useCrearCarritoCompras();
  const { mutateAsync: actualizarCarrito } = useActualizarCarritoCompras();

  const { toggleOffcanvas } = useOffcanvasStore();
  const { toggleBalanceo } = useBalanceStore();

  const [productosTop, setProductosTop] = useState([]);

  // 🔹 Actualiza cada 10s los productos destacados
  useEffect(() => {
    if (productos && productos.length > 0) {
      setProductosTop(seleccionarProductosAleatorios(productos, 6));

      const interval = setInterval(() => {
        setProductosTop(seleccionarProductosAleatorios(productos, 6));
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [productos]);
  // Estados de carga y error
  if (isLoading) return <p className="text-center">Cargando productos...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500">Error al cargar productos</p>
    );

  //  Función para agregar productos al carrito
  const handleAddToCart = async (producto) => {
    const existing = carritoApi.find(
      (item) => item.productoId === producto.productoId && item.tallaId === 1
    );

    if (existing) {
      // Si el producto ya existe en el carrito, actualizar cantidad y subtotal
      await actualizarCarrito({
        carritoId: existing.carritoId,
        cantidad: existing.cantidad + 1,
        subTotal: (existing.cantidad + 1) * existing.precioUnitario,
      });
    } else {
      // Si no existe, crear un nuevo item en el carrito
      await crearCarrito({
        usuarioId,
        productoId: producto.productoId,
        tallaId: 1,
        cantidad: 1,
        precioUnitario: producto.precio,
        subTotal: producto.precio,
        estado: true,
      });
    }

    // Mostrar carrito y actualizar balance
    toggleOffcanvas(true);
    toggleBalanceo(true);
  };

  return (
    <section className="py-16  dark:bg-gray-900 dark:text-whit">
      <div className="container">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1
            data-aos="fade-up"
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
          >
            Top Productos ⭐
          </h1>
          <p data-aos="fade-up" className="text-lg text-gray-500 mt-2">
            Descubre nuestra selección destacada
          </p>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {productosTop.map((producto) => (
            <SwiperSlide
              key={producto.productoId}
              className="flex justify-center items-stretch"
            >
              <GeneralCard
                producto={producto}
                onAddToCart={handleAddToCart}
                compact
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TopProducts;
