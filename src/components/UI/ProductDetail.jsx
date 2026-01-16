import React, { lazy, Suspense } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import Button from "../../components/UI/Button";
import { useProductoTallas } from "../../hooks/useProductoTalla";
import { useProductSelection } from "../../utils/useProductSelection";
import { useRelatedProducts } from "../../utils/useRelatedProducts";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const GeneralCard = lazy(() => import("./GeneralCard"));

const ProductDetail = ({ product, availableSizes, onAddToCart = () => {} }) => {
  const { data: allProducts } = useProductoTallas();

  /* 🔹 HOOK DE SELECCIÓN (talla + cantidad) */
  const {
    selectedSize,
    quantity,
    selectSize,
    increaseQty,
    decreaseQty,
    setQuantity,
    reset,
  } = useProductSelection();

  /* 🔹 HOOK DE PRODUCTOS RELACIONADOS */
  const productosTop = useRelatedProducts(
    allProducts,
    product?.productoId
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500 dark:text-gray-300 animate-pulse">
          Cargando producto...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center pt-[90px] gap-10 px-4">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col lg:flex-row gap-10">
        {/* Imagen */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full max-w-md h-auto rounded-2xl object-contain shadow-md"
          />
        </div>

        {/* Información */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
            {product.nombre}
          </h1>

          {/* Badges */}
          <div className="flex gap-3 mt-2">
            <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-semibold text-sm shadow-sm">
              Envío 24h
            </span>
            <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-semibold text-sm shadow-sm">
              Retiro Gratis
            </span>
          </div>

          {/* Precio */}
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
                  onClick={() => selectSize(size)}
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

          {/* Cantidad */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={decreaseQty}
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
              onClick={increaseQty}
              className="border rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <IoAddCircleOutline size={24} />
            </button>
          </div>

          {/* Botón agregar al carrito */}
          <Button
            onClick={() => {
              onAddToCart(product, selectedSize, quantity);
              reset(); // 🧹 limpia talla + cantidad
            }}
            disabled={!selectedSize || selectedSize.stock === 0}
            icon={FaShoppingCart}
            className="mt-6 w-full text-lg"
          >
            Agregar al carrito
          </Button>
        </div>
      </div>

      {/* Especificaciones + descripción */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
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
                <td className="py-2">
                  {selectedSize ? selectedSize.stock : product.stock}
                </td>
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

        <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner">
          <h2 className="font-semibold mb-2 text-xl text-gray-800 dark:text-white">
            Descripción
          </h2>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
            {product.descripcion}
          </p>
        </div>
      </div>

      {/* Carousel productos relacionados */}
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
                <Suspense
                  fallback={
                    <div className="w-40 h-52 bg-gray-200 animate-pulse rounded-xl" />
                  }
                >
                  <GeneralCard
                    producto={productoRelacionado}
                    compact
                    onAddToCart={() => {}}
                  />
                </Suspense>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
