/**
 * Products.jsx
 *
 *
 * Funcionalidades clave:
 * 1. Obtención de productos desde el hook personalizado useProductos.
 * 2. Selección aleatoria de productos destacados, actualizada automáticamente cada 10 segundos.
 * 3. Integración con el carrito de compras, permitiendo agregar productos directamente desde el carrusel.
 * 4. Uso de Swiper para crear un carrusel responsive con autoplay, paginación y navegación.
 * 5. Manejo de estados de carga y error para mejorar la experiencia de usuario.
 *
 * Propósito:
 * Promocionar productos favoritos de manera dinámica, incentivando la interacción
 * y facilitando la adición de productos al carrito de manera rápida y visual.
 */
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { BsCartPlus } from "react-icons/bs";
import GeneralCard from "../../../components/UI/GeneralCard";
import { useProductos } from "../../../hooks/useProducto";
import Button from "../../../components/UI/Button";
import useOffcanvasStore from "../../../store/offcanvasStore";
import useBalanceStore from "../../../store/balanceStore";
import { useCrearCarritoCompras } from "../../../hooks/useCarrito";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// 🔹 Función auxiliar para productos aleatorios
const seleccionarProductosAleatorios = (productos, cantidad) => {
  const barajado = [...productos].sort(() => 0.5 - Math.random());
  return barajado.slice(0, cantidad);
};

const Products = ({ usuarioId = 1 }) => {
  // Hook para obtener productos desde la API
  const { data: productos, isLoading, isError } = useProductos();
  // Hooks para manejar el offcanvas y animaciones de balanceo
  const { toggleOffcanvas } = useOffcanvasStore();
  const { toggleBalanceo } = useBalanceStore();
  const crearCarrito = useCrearCarritoCompras();
  // Estado local para productos destacados
  const [productosTop, setProductosTop] = useState([]);

  // 🔹 Selección aleatoria cada 10s
  useEffect(() => {
    if (productos && productos.length > 0) {
      setProductosTop(seleccionarProductosAleatorios(productos, 6));
      const interval = setInterval(() => {
        setProductosTop(seleccionarProductosAleatorios(productos, 6));
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [productos]);
  // Manejo de estados de carga y error
  if (isLoading)
    return <p className="text-center text-gray-500">Cargando productos...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500">Error al cargar productos</p>
    );

  // Función para agregar producto al carrito
  const handleAddToCart = async (producto, tallaSeleccionada) => {
    await crearCarrito.mutateAsync({
      usuarioId,
      productoId: producto.productoId,
      tallaId: producto.tallaId ?? null,
      cantidad: 1,
      precioUnitario: producto.precio,
      subTotal: producto.precio,
      estado: true,
    });

    // Limpiar selección
    setSelectedTallas((prev) => {
      const updated = { ...prev };
      delete updated[product.productoId];
      return updated;
    });

    // Actualiza UI: cierra offcanvas y activa animación de balanceo
    toggleOffcanvas(true);
    toggleBalanceo(true);
  };

  return (
    <section className="py-16  dark:bg-gray-900 dark:text-whit">
      <div className="container">
        {/* Header */}
        <div className="text-left mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900  dark:text-white">
            Productos favoritos
          </h1>
          <p className="text-lg text-gray-500">
            ¡Explora nuestros productos favoritos seleccionados!
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
            1280: { slidesPerView: 4 },
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

export default Products;
