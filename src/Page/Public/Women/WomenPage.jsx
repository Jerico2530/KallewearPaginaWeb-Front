// src/components/Women/WomenPage.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- añadido
import useTotalStore from "../../../store/totalProductStore";
import useBalanceStore from "../../../store/balanceStore";
import useSizeFilterStore from "../../../store/sizeFilterStore";
import SizeFilter from "../../../Features/Filters/SizeFilter/SizeFilter";
import SizeFilterSkeleton from "../../../Features/Filters/SizeFilter/SizeFilterSkeleton";

import useCategoryFilterStore from "../../../store/categoryFilterStore";
import CategoryFilter from "../../../Features/Filters/CategoryFilter/CategoryFilter";

import { useProductoTallas } from "../../../hooks/useProductoTalla";
import {
  useCarritoCompras,
  useCrearCarritoCompras,
  useActualizarCarritoCompras,
} from "../../../hooks/useCarrito";
import useUserStore from "../../../store/userStore";
import ProductCard from "../../../components/UI/ProductCard";

const WomenPage = () => {
  const navigate = useNavigate(); // <-- añadido
  const { getTotalProducts } = useTotalStore();
  const { toggleBalanceo } = useBalanceStore();
  const { selectedSizes } = useSizeFilterStore();
  const { selectedCategories } = useCategoryFilterStore();

  const { data: productoTallas, isLoading, isError } = useProductoTallas();
  const { data: carrito = [] } = useCarritoCompras();
  const crearCarrito = useCrearCarritoCompras();
  const actualizarCarrito = useActualizarCarritoCompras();
  const { usuarioId } = useUserStore();

  const [selectedTallas, setSelectedTallas] = useState({});

  // 🔹 Estado para filtro móvil
  const [filtroVisible, setFiltroVisible] = useState(false);
  const toggleFiltro = () => setFiltroVisible((prev) => !prev);

  // 🔹 Agrupar productos (solo "Mujer")
  const productosAgrupados = useMemo(() => {
    if (!productoTallas) return [];
    const map = new Map();

    productoTallas
      .filter((item) => item.genero === "Mujer" || item.genero === "Unisex")
      .forEach((item) => {
        if (!map.has(item.productoId)) {
          map.set(item.productoId, {
            ...item,
            availableSizes: [item.tipoTalla],
            tallasDetalle: [
              {
                productoTallaId: item.productoTallaId,
                productoCategoriaId: item.productoCategoriaId,
                categoria: item.categoria,
                tallaId: item.tallaId,
                tipoTalla: item.tipoTalla,
                stock: item.stock,
              },
            ],
          });
        } else {
          const existing = map.get(item.productoId);
          if (!existing.availableSizes.includes(item.tipoTalla)) {
            existing.availableSizes.push(item.tipoTalla);
          }
          if (!existing.tallasDetalle.some((t) => t.tallaId === item.tallaId)) {
            existing.tallasDetalle.push({
              productoTallaId: item.productoTallaId,
              productoCategoriaId: item.productoCategoriaId,
              categoria: item.categoria,
              tallaId: item.tallaId,
              tipoTalla: item.tipoTalla,
              stock: item.stock,
            });
          }
        }
      });

    return Array.from(map.values());
  }, [productoTallas]);

  // 🔹 Filtrar por tallas y categorías
  const filteredProducts = useMemo(() => {
    let result = productosAgrupados;

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.categoria)
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter((product) =>
        product.tallasDetalle.some((t) => selectedSizes.includes(t.tipoTalla))
      );
    }

    return result;
  }, [selectedSizes, selectedCategories, productosAgrupados]);

  const totalFiltered = filteredProducts.length;

  // 🔹 Agregar producto al carrito
  const handleAddToCart = (product, tallaSeleccionada) => {
    if (!tallaSeleccionada) return;
    crearCarrito.mutate(
      {
        usuarioId,
        productoTallaId: tallaSeleccionada.productoTallaId,
        cantidad: 1,
        precioUnitario: product.precio,
        subTotal: product.precio,
        estado: true,
      },
      {
        onError: (error) =>
          console.error("Error al agregar al carrito:", error),
        onSuccess: () => {
          setSelectedTallas((prev) => {
            const updated = { ...prev };
            delete updated[product.productoId];
            return updated;
          });
          toggleBalanceo(true); // animación opcional
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <div className="h-[80px] md:h-[90px]"></div>

      <main className="flex flex-col lg:flex-row gap-8 p-6 lg:p-10">
        {/* Filtro lateral */}
        <aside
          className="lg:w-1/4 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md rounded-xl p-4
             sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto
             hidden lg:block"
        >
          {isLoading ? (
            <SizeFilterSkeleton />
          ) : isError ? (
            <p className="text-red-500 dark:text-red-400 text-center">
              Error al cargar filtros
            </p>
          ) : (
            <>
              <div className="mb-6 bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow">
                <SizeFilter
                  products={productosAgrupados}
                  totalFiltered={totalFiltered}
                />
              </div>

              <div className="mb-6 bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow">
                <CategoryFilter
                  products={productosAgrupados}
                  totalFiltered={totalFiltered}
                />
              </div>
            </>
          )}
        </aside>

        {/* Filtro móvil */}
        <div className="lg:hidden">
          <button
            onClick={toggleFiltro}
            className="mb-4 bg-primary text-white py-2 px-4 rounded-md"
          >
            Filtrar productos
          </button>

          {filtroVisible && (
            <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
              <div className="w-3/4 max-w-xs bg-white dark:bg-gray-800 p-4 overflow-y-auto h-full shadow-lg">
                <button
                  onClick={() => setFiltroVisible(false)}
                  className="mb-4 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md"
                >
                  Cerrar
                </button>
                <SizeFilter
                  products={productosAgrupados}
                  totalFiltered={totalFiltered}
                />
                <CategoryFilter
                  products={productosAgrupados}
                  totalFiltered={totalFiltered}
                />
              </div>
            </div>
          )}
        </div>

        {/* Lista de productos */}
        <section className="flex-1">
          {isLoading ? (
            <SizeFilterSkeleton />
          ) : isError ? (
            <p className="text-center mt-8 text-red-500 dark:text-red-400">
              Error al cargar los productos.
            </p>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const tallaSeleccionada =
                  selectedTallas[product.productoId] || null;
                return (
                  <ProductCard
                    key={product.productoId}
                    producto={product}
                    tallaSeleccionada={tallaSeleccionada}
                    onSelectTalla={(talla) =>
                      setSelectedTallas((prev) => {
                        const current = prev[product.productoId];
                        const isSelected = current?.tallaId === talla.tallaId;
                        if (isSelected) {
                          const updated = { ...prev };
                          delete updated[product.productoId];
                          return updated;
                        }
                        return { ...prev, [product.productoId]: talla };
                      })
                    }
                    onAddToCart={() =>
                      handleAddToCart(product, tallaSeleccionada)
                    }
                    onImageClick={
                      () =>
                        navigate(
                          `/producto/${product.tallasDetalle[0].productoTallaId}`
                        ) 
                    }
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-center mt-8 text-lg text-gray-600 dark:text-gray-300">
              No hay productos disponibles.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default WomenPage;
