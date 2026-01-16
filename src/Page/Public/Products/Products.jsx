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
import GeneralCard from "../../../components/UI/GeneralCard";
import { useProductos } from "../../../hooks/useProducto";
import DataLoader from "../../../components/UI/DataLoader";
import useUserStore from "../../../store/userStore";
import { useNavigate } from "react-router-dom";


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

const Products = () => {
  /* ===================== DATA ===================== */
  const { data: productos, isLoading, isError } = useProductos();
  const navigate = useNavigate();

  /* ===================== STATE ===================== */
  const [productosTop, setProductosTop] = useState([]);

  /* ===================== EFFECT ===================== */
  useEffect(() => {
    if (!productos || productos.length === 0) return;

    setProductosTop(seleccionarProductosAleatorios(productos, 6));

    const interval = setInterval(() => {
      setProductosTop(seleccionarProductosAleatorios(productos, 6));
    }, 10000);

    return () => clearInterval(interval);
  }, [productos]);

  return (
    <section className="py-16 dark:bg-gray-900 dark:text-white">
      <div className="container">
        {/* ================= HEADER ================= */}
        <div className="text-left mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Productos favoritos
          </h1>
          <p className="text-lg text-gray-500">
            ¡Explora nuestros productos favoritos seleccionados!
          </p>
        </div>

        {/* ================= DATA LOADER ================= */}
        <DataLoader
          isLoading={isLoading}
          isError={isError}
          data={productosTop.length > 0 ? productosTop : null}
          fallback={null}
          loader={
            <p className="text-center text-gray-500">Cargando productos...</p>
          }
          errorComponent={
            <p className="text-center text-red-500">
              Error al cargar productos
            </p>
          }
        >
          {(productosRender) => (
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
              {productosRender.map((producto) => (
                <SwiperSlide
                  key={producto.productoId}
                  className="flex justify-center items-stretch"
                >
                  <GeneralCard
                    producto={producto}
                    compact
                    /* ✅ CAMBIO CLAVE:
                       - Eliminado onAddToCart
                       - Se usa SOLO navegación al detalle
                    */
                    onViewDetail={() =>
                      navigate(`/producto/${producto.productoId}`, {
                        state: { product: producto },
                      })
                    }
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </DataLoader>
      </div>
    </section>
  );
};

export default Products;
