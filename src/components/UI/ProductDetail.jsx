/**
 * ProductDetail.jsx
 * -------------------------------------------------
 * Vista de detalle de producto dentro del e-commerce.
 *
 * Funcionalidades clave:
 * • Visualización completa del producto (imagen, precio, tallas, descripción, stock).
 * • Selección de talla, control de cantidad y acción para agregar al carrito.
 * • Render dinámico de productos relacionados mediante carrusel.
 *
 * Propósito del componente:
 * Representar la página individual de un producto, conectada con la lógica
 * del carrito y la data del catálogo, optimizada para conversión y engagement.
 */
import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import GeneralCard from "./GeneralCard";
import { useProductoTallas } from "../../hooks/useProductoTalla";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Selecciona productos aleatorios excluyendo el actual
const seleccionarProductosAleatorios = (productos, cantidad, excludeId) => {
  const filtrados = productos.filter((p) => p.productoId !== excludeId);
  const barajado = [...filtrados].sort(() => 0.5 - Math.random());
  return barajado.slice(0, cantidad);
};

const ProductDetail = ({ product, availableSizes, onAddToCart = () => {} }) => {
  const [selectedSize, setSelectedSize] = useState(null); // Talla elegida para comprar
  const [quantity, setQuantity] = useState(1); // Cantidad del producto
  const { data: allProducts } = useProductoTallas(); // Lista global de productos-talla
  const [productosTop, setProductosTop] = useState([]); // Productos recomendados dinámicos

  // 🔹 Generar productos aleatorios relacionados
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      setProductosTop(
        seleccionarProductosAleatorios(allProducts, 6, product.productoId)
      );
      const interval = setInterval(() => {
        setProductosTop(
          seleccionarProductosAleatorios(allProducts, 6, product.productoId)
        );
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [allProducts, product.productoId]);

  // Muestra mensaje de carga si el producto aún no está disponible
  if (!product)
    return <p className="text-center mt-20 text-lg">Cargando producto...</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center pt-[90px] gap-10 px-4">
      {/* Contenedor principal */}
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col lg:flex-row gap-10">
        {/* Imagen */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full max-w-md h-auto rounded-2xl object-contain shadow-md"
          />
        </div>

        {/* Información principal */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
            {product.nombre}
          </h1>

          {/* Badges de beneficios */}
          <div className="flex gap-3 mt-2">
            <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-semibold text-sm shadow-sm">
              Envío 24h
            </span>
            <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-semibold text-sm shadow-sm">
              Retiro Gratis
            </span>
          </div>

          {/* Precio del producto */}
          <div className="text-3xl font-bold text-red-600 mt-4">
            S/. {product.precio.toFixed(2)}
          </div>

          {/* Selección de tallas */}
          <div className="mt-6">
            <label className="font-semibold text-gray-700 dark:text-gray-200">
              Talla:
            </label>
            <div className="flex flex-wrap gap-3 mt-2">
              {availableSizes.map((size) => (
                <button
                  key={size.productoTallaId}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg transition font-medium ${
                    selectedSize?.productoTallaId === size.productoTallaId
                      ? "bg-red-600 text-white border-red-600 shadow-lg"
                      : "bg-white dark:bg-gray-700 border-gray-300 hover:border-red-600"
                  }`}
                >
                  {size.tipoTalla}
                </button>
              ))}
            </div>
          </div>

          {/* Control de cantidad con validación mínima */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setQuantity(Math.max(quantity - 1, 1))}
              className="border rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <IoRemoveCircleOutline size={24} />
            </button>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 text-center border rounded-lg px-3 py-2 bg-white dark:bg-gray-700"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="border rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <IoAddCircleOutline size={24} />
            </button>
          </div>

          {/* Botón agregar al carrito */}
          <button
            onClick={() => {
              if (!selectedSize) return alert("Selecciona una talla");
              onAddToCart(product, selectedSize, quantity);
            }}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-lg flex items-center justify-center gap-3 shadow-lg transition"
          >
            <FaShoppingCart /> Agregar al carrito
          </button>
        </div>
      </div>

      {/* Sección de especificaciones + descripción */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        {/* Cuadro de especificaciones como tabla */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow-inner">
          <h2 className="font-semibold mb-4 text-xl text-gray-800 dark:text-white border-b pb-2">
            Especificaciones
          </h2>
          <table className="w-full text-left text-gray-700 dark:text-gray-200">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">Nombre</td>
                <td className="py-2">{product.nombre}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Categoría</td>
                <td className="py-2">{product.categoria}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Talla</td>
                <td className="py-2">
                  {selectedSize ? selectedSize.tipoTalla : "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Moneda</td>
                <td className="py-2">{product.moneda}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Género</td>
                <td className="py-2">{product.genero}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Stock</td>
                <td className="py-2">{product.stock}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Estado</td>
                <td className="py-2">
                  {product.estado ? "Activo" : "Inactivo"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Descripción al lado del cuadro */}
        <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner">
          <h2 className="font-semibold mb-2 text-xl text-gray-800 dark:text-white">
            Descripción
          </h2>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
            {product.descripcion}
          </p>
        </div>
      </div>

      {/* -------------------- Carousel de productos relacionados -------------------- */}
      {productosTop.length > 0 && (
        <div className="w-full max-w-6xl mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            Productos relacionados
          </h2>

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
            {productosTop.map((productoRelacionado) => (
              <SwiperSlide
                key={productoRelacionado.productoTallaId}
                className="flex justify-center items-stretch"
              >
                {/* Tarjeta compacta para sugerencias */}
                <GeneralCard
                  producto={productoRelacionado}
                  compact
                  onAddToCart={() => {}}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
