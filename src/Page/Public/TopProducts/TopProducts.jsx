import React, { useState, useEffect } from "react";
import GeneralCard from "../../../components/UI/GeneralCard";
import { useProductos } from "../../../hooks/useProducto";
import {
  useCrearCarritoCompras,
  useActualizarCarritoCompras,
  useCarritoCompras,
} from "../../../hooks/useCarrito";
import { useNavigate } from "react-router-dom";
import useOffcanvasStore from "../../../store/offcanvasStore";
import useBalanceStore from "../../../store/balanceStore";
import useUserStore from "../../../store/userStore";

import { getRandomItems } from "../../../utils/useRandomProducts";
import { useAddToCart } from "../../../utils/useAddToCart";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TopProducts = () => {
  /* ===================== DATA ===================== */
  const { data: productos = [], isLoading, isError } = useProductos();
  const { data: carrito = [] } = useCarritoCompras();

  const { mutateAsync: crearCarrito } = useCrearCarritoCompras();
  const { mutateAsync: actualizarCarrito } = useActualizarCarritoCompras();

  /* ===================== STORES ===================== */
  const { toggleOffcanvas } = useOffcanvasStore();
  const { toggleBalanceo } = useBalanceStore();
  const { usuarioId } = useUserStore();
  const navigate = useNavigate();

  /* ===================== STATE ===================== */
  const [productosTop, setProductosTop] = useState([]);

  /* ===================== BUSINESS LOGIC ===================== */
  const { addToCart } = useAddToCart({
    carrito,
    crearCarrito,
    actualizarCarrito,
    usuarioId,
    toggleOffcanvas,
    toggleBalanceo,
  });

  /* ===================== EFFECTS ===================== */
  useEffect(() => {
    if (!productos.length) return;

    // ✔ Selección aleatoria delegada al service
    setProductosTop(getRandomItems(productos, 6));

    const interval = setInterval(() => {
      setProductosTop(getRandomItems(productos, 6));
    }, 10000);

    return () => clearInterval(interval);
  }, [productos]);

  /* ===================== STATES UI ===================== */
  if (isLoading) return <p className="text-center">Cargando productos...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500">Error al cargar productos</p>
    );

  /* ===================== UI (SIN CAMBIOS) ===================== */
  return (
    <section className="py-16 dark:bg-gray-900 dark:text-whit">
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
                compact
                onAddToCart={(prod, talla) =>
                  addToCart({ producto: prod, talla })
                }
                onViewDetail={() =>
                  navigate(`/producto/${producto.productoId}`, {
                    state: { product: producto },
                  })
                }
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TopProducts;
