import { useMemo, useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";

import useBalanceStore from "../../../store/balanceStore";
import useSizeFilterStore from "../../../store/sizeFilterStore";
import useCategoryFilterStore from "../../../store/categoryFilterStore";
import useUserStore from "../../../store/userStore";

import { useProductoTallas } from "../../../hooks/useProductoTalla";
import {
  useCarritoCompras,
  useCrearCarritoCompras,
} from "../../../hooks/useCarrito";

import { groupProducts } from "../../../utils/productHelpers";
import useSelectedTallas from "../../../utils/useSelectedTallas";
import useCarritoActions from "../../../utils/useCarritoActions";

const SizeFilter = lazy(() =>
  import("../../../Features/Filters/SizeFilter/SizeFilter")
);
const SizeFilterSkeleton = lazy(() =>
  import("../../../Features/Filters/SizeFilter/SizeFilterSkeleton")
);
const CategoryFilter = lazy(() =>
  import("../../../Features/Filters/CategoryFilter/CategoryFilter")
);
const ProductCard = lazy(() => import("../../../components/UI/ProductCard"));

const WomenPage = () => {
  const navigate = useNavigate();

  /* ================== STORES ================== */
  const { showCartFeedback } = useBalanceStore();
  const { selectedSizes } = useSizeFilterStore();
  const { selectedCategories } = useCategoryFilterStore();
  const { usuarioId } = useUserStore();

  /* ================== DATA ================== */
  const { data: productoTallas, isLoading, isError } = useProductoTallas();
  useCarritoCompras(); // solo para mantener sync del carrito
  const crearCarrito = useCrearCarritoCompras();

  /* ================== STATE ================== */
  const { selectedTallas, dispatchTallas } = useSelectedTallas();
  const [filtroVisible, setFiltroVisible] = useState(false);

  /* ================== ACTIONS ================== */
  const { handleAddToCart } = useCarritoActions({
    crearCarrito,
    usuarioId,
    dispatchTallas,
    showCartFeedback,
  });

  /* ================== MEMOS ================== */
  const productosAgrupados = useMemo(
    () => groupProducts(productoTallas),
    [productoTallas]
  );

  const filteredProducts = useMemo(() => {
    return productosAgrupados
      .filter((product) => product.genero === "Mujer")
      .filter((product) => {
        const categoryMatch =
          selectedCategories.length === 0 ||
          selectedCategories.includes(product.categoria);

        const sizeMatch =
          selectedSizes.length === 0 ||
          product.tallasDetalle.some((t) =>
            selectedSizes.includes(t.tipoTalla)
          );

        return categoryMatch && sizeMatch;
      });
  }, [productosAgrupados, selectedCategories, selectedSizes]);

  const totalFiltered = filteredProducts.length;

  /* ================== UI ================== */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <div className="h-[80px] md:h-[90px]" />

      <main className="flex flex-col lg:flex-row gap-8 p-6 lg:p-10">
        {/* ===== ASIDE DESKTOP ===== */}
        <aside className="lg:w-1/4 bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 sticky top-24 hidden lg:block">
          <Suspense
            fallback={
              <div className="h-40 bg-gray-100 animate-pulse rounded-xl" />
            }
          >
            {isLoading ? (
              <SizeFilterSkeleton />
            ) : isError ? (
              <p className="text-red-500 text-center">
                Error al cargar filtros
              </p>
            ) : (
              <>
                {/* 🔽🔽🔽 CAMBIO DE UI AQUÍ 🔽🔽🔽 */}
                {/* Contenedor con separación vertical entre filtros */}
                <div className="space-y-6">
                  <SizeFilter
                    products={productosAgrupados}
                    totalFiltered={totalFiltered}
                  />

                  <CategoryFilter
                    products={productosAgrupados}
                    totalFiltered={totalFiltered}
                  />
                </div>
                {/* 🔼🔼🔼 FIN DEL CAMBIO DE UI 🔼🔼🔼 */}
              </>
            )}
          </Suspense>
        </aside>

        {/* ===== PRODUCTS ===== */}
        <section className="flex-1">
          <Suspense fallback={<SizeFilterSkeleton />}>
            {isLoading ? (
              <SizeFilterSkeleton />
            ) : isError ? (
              <p className="text-center text-red-500">
                Error al cargar productos
              </p>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.productoId}
                    producto={product}
                    tallaSeleccionada={
                      selectedTallas[product.productoId] || null
                    }
                    onSelectTalla={(talla) =>
                      dispatchTallas({
                        type: "TOGGLE_TALLA",
                        payload: {
                          productoId: product.productoId,
                          talla,
                        },
                      })
                    }
                    onAddToCart={handleAddToCart}
                    onImageClick={() =>
                      navigate(
                        `/producto/${product.tallasDetalle[0].productoTallaId}`,
                        { state: { product } }
                      )
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">
                No hay productos disponibles
              </p>
            )}
          </Suspense>
        </section>
      </main>
    </div>
  );
};

export default WomenPage;
