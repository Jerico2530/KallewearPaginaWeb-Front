// src/components/Women/WomenPage.jsx
import { useEffect, useMemo, useState } from "react";
import useOffcanvasStore from "../../../store/offcanvasStore";
import useTotalStore from "../../../store/totalProductStore";
import useBalanceStore from "../../../store/balanceStore";
import useSizeFilterStore from "../../../store/sizeFilterStore";
import SizeFilter from "../../../Features/Filters/SizeFilter/SizeFilter";
import SizeFilterSkeleton from "../../../Features/Filters/SizeFilter/SizeFilterSkeleton";
import { useProductoTallas } from "../../../hooks/useProductoTalla";
import { useCarritoCompras, useCrearCarritoCompras, useActualizarCarritoCompras, } from "../../../hooks/useCarrito";
import useUserStore from "../../../store/userStore";
import ProductCard from "../../../components/UI/ProductCard";

const UnisexPage = () => {
  const { getTotalProducts } = useTotalStore();
  const { toggleBalanceo } = useBalanceStore();
  const { isVisible, toggleOffcanvas } = useOffcanvasStore();
  const { selectedSizes } = useSizeFilterStore();

  const { data: productoTallas, isLoading, isError } = useProductoTallas();
  const { data: carrito = [] } = useCarritoCompras();
  const crearCarrito = useCrearCarritoCompras();
  const actualizarCarrito = useActualizarCarritoCompras();
  const { usuarioId } = useUserStore(); // 🔹 usuario dinámico

  const [selectedTallas, setSelectedTallas] = useState({});

  // 🔹 Mostrar carrito balanceado si hay productos
  useEffect(() => {
    if (carrito.length > 0) {
      const total = getTotalProducts(carrito);
      if (!isVisible) toggleOffcanvas(true);
      if (total > 0) toggleBalanceo(true);
    }
  }, [carrito, getTotalProducts, toggleBalanceo, toggleOffcanvas, isVisible]);

  // 🔹 Agrupar productos (solo "Mujer")
  const productosAgrupados = useMemo(() => {
    if (!productoTallas) return [];
    const map = new Map();

    productoTallas
      .filter((item) => item.genero === "Unisex") // 👈 solo mujeres
      .forEach((item) => {
        if (!map.has(item.productoId)) {
          map.set(item.productoId, {
            ...item,
            availableSizes: [item.tipoTalla],
            tallasDetalle: [
              {
                productoTallaId: item.productoTallaId,
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
              tallaId: item.tallaId,
              tipoTalla: item.tipoTalla,
              stock: item.stock,
            });
          }
        }
      });

    return Array.from(map.values());
  }, [productoTallas]);

  // 🔹 Filtrar por tallas seleccionadas
  const filteredProducts = useMemo(() => {
    if (!selectedSizes.length) return productosAgrupados;
    return productosAgrupados.filter((product) =>
      product.tallasDetalle.some((t) => selectedSizes.includes(t.tipoTalla))
    );
  }, [selectedSizes, productosAgrupados]);

  const totalFiltered = filteredProducts.length;

  // 🔹 Agregar producto al carrito
  const handleAddToCart = (product, tallaSeleccionada) => {
    if (!tallaSeleccionada) return;
    crearCarrito.mutate({
      usuarioId,
      productoTallaId: tallaSeleccionada.productoTallaId, 
      cantidad: 1,
      precioUnitario: product.precio,
      subTotal: product.precio,
      estado: true,
    }, {
      onError: (error) => {
        console.error("Error al agregar al carrito:", error);
      },
      onSuccess: () => {
        // Limpiar selección de talla
        setSelectedTallas((prev) => {
          const updated = { ...prev };
          delete updated[product.productoId];
          return updated;
        });

        // Limpiar selección
        setSelectedTallas((prev) => {
          const updated = { ...prev };
          delete updated[product.productoId];
          return updated;
        });

        toggleOffcanvas(true);
        toggleBalanceo(true);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <div className="h-[80px] md:h-[90px]"></div>

      <main className="flex flex-col lg:flex-row gap-8 p-6 lg:p-10">
        {/* Filtro lateral */}
        <aside className="lg:w-1/4 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md rounded-xl p-4 sticky top-24 h-fit">
          {isLoading ? (
            <SizeFilterSkeleton />
          ) : isError ? (
            <p className="text-red-500 dark:text-red-400 text-center">Error al cargar filtros</p>
          ) : (
            <SizeFilter
              products={productosAgrupados}
              totalFiltered={totalFiltered}
            />
          )}
        </aside>

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
                    onAddToCart={() => handleAddToCart(product, tallaSeleccionada)}
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

export default UnisexPage;
