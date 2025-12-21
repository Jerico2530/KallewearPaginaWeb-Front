// ✅ src/components/MenPage/MenPage.jsx 
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

// Componente principal de la página de "Hombres"
const MenPage = () => {
  // Desestructuramos funciones/estados desde nuestros stores/hooks
  const { getTotalProducts } = useTotalStore();                    // función que calcula el total de productos en el carrito
  const { toggleBalanceo } = useBalanceStore();                   // función para activar/desactivar el indicador (balanceo)
  const { isVisible, toggleOffcanvas } = useOffcanvasStore();     // isVisible: si el offcanvas está abierto; toggleOffcanvas: abre/cierra
  const { selectedSizes } = useSizeFilterStore();                 // array de tallas seleccionadas para filtrar (ej: ["M", "L"])

  // Consumimos datos desde hooks (React Query u otro fetch)
  const { data: productoTallas, isLoading, isError } = useProductoTallas(); // lista de registros ProductoTalla
  const { data: carrito = [] } = useCarritoCompras();             // datos del carrito; por defecto [] si undefined
  const crearCarrito = useCrearCarritoCompras();                  // mutation para crear item en carrito
  const actualizarCarrito = useActualizarCarritoCompras();       // mutation para actualizar item del carrito
  const { usuarioId } = useUserStore();                           // id del usuario actual (necesario para crear carrito)

  // Estado local para almacenar la talla seleccionada por producto
  const [selectedTallas, setSelectedTallas] = useState({});       // objeto: { [productoId]: tallaSeleccionada }

  // useEffect que se ejecuta cuando cambia el carrito: abre el offcanvas y activa balance si hay items
  useEffect(() => {
    if (carrito.length > 0) {
      const total = getTotalProducts(carrito);    // calcula total de items/valor según implementación
      if (!isVisible) toggleOffcanvas(true);      // si offcanvas no está visible, lo abre
      if (total > 0) toggleBalanceo(true);        // si total > 0, activa indicador de balanceo
    }
    // dependencias: se volverá a ejecutar cuando cambien estas referencias
  }, [carrito, getTotalProducts, toggleBalanceo, toggleOffcanvas, isVisible]);

  // -------------------------------------------------------------
  // Agrupar productos por productoId para mostrar tallas como opciones
  // -------------------------------------------------------------
  const productosAgrupados = useMemo(() => {
    if (!productoTallas) return [];               // si aún no hay datos, retornar array vacío

    const map = new Map();                        // usamos Map para agrupar por productoId (evita duplicados)

    productoTallas
      .filter((item) => item.genero === "Hombre"|| item.genero === "Unisex") // filtramos solo productos de género "Hombre"
      .forEach((item) => {
        // Si aún no existe el producto en el map, lo agregamos con estructura inicial
        if (!map.has(item.productoId)) {
          map.set(item.productoId, {
            ...item,                              // copiamos propiedades del item (puede incluir nombre, precio, imagen, etc.)
            availableSizes: [item.tipoTalla],     // arreglo con los tipos de talla disponibles (strings)
            tallasDetalle: [                      // detalles por talla (incluimos objecto por cada talla)
              {
                productoTallaId: item.productoTallaId, // IMPORTANT: id único de la relación producto-talla
                tallaId: item.tallaId,             // id de la talla (ej: FK a tabla Talla)
                tipoTalla: item.tipoTalla,         // tipo de talla (ej: "M", "L")
                stock: item.stock,                 // stock disponible para esa combinación
              },
            ],
          });
        } else {
          // Si el producto ya está en el map, actualizamos su entrada
          const existing = map.get(item.productoId);

          // 1) Añadimos tipoTalla a availableSizes si no existe (para opciones de UI)
          if (!existing.availableSizes.includes(item.tipoTalla)) {
            existing.availableSizes.push(item.tipoTalla);
          }

          // 2) Añadimos detalle de talla si no existe la misma tallaId (evitar duplicados)
          if (!existing.tallasDetalle.some((t) => t.tallaId === item.tallaId)) {
            existing.tallasDetalle.push({
              // Nota: aquí conviene también incluir productoTallaId si lo necesitas luego
              productoTallaId: item.productoTallaId,
              tallaId: item.tallaId,
              tipoTalla: item.tipoTalla,
              stock: item.stock,
            });
          }
        }
      });

    // Convertimos el Map (valores) a un array para iterar en la UI
    return Array.from(map.values());
  }, [productoTallas]); // se recalcula solo cuando productoTallas cambie

  // -------------------------------------------------------------
  // Filtrar productos según tallas seleccionadas (desde SizeFilterStore)
  // -------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    if (!selectedSizes.length) return productosAgrupados; // si no hay tallas seleccionadas, devolver todo

    // Filtramos los productos que tengan al menos una talla que coincida con selectedSizes
    return productosAgrupados.filter((product) =>
      product.tallasDetalle.some((t) => selectedSizes.includes(t.tipoTalla))
    );
  }, [selectedSizes, productosAgrupados]); // recalcular cuando cambien tallas seleccionadas o agrupados

  const totalFiltered = filteredProducts.length; // cantidad de productos después del filtro

  // -------------------------------------------------------------
  // Función que maneja agregar un producto al carrito
  // product: objeto agrupado (producto con tallas)
  // tallaSeleccionada: la talla seleccionada por el usuario para ese producto
  // -------------------------------------------------------------
  const handleAddToCart = async (product, tallaSeleccionada) => {
    if (!tallaSeleccionada) return;

    crearCarrito.mutate({
      usuarioId,
      productoTallaId: tallaSeleccionada.productoTallaId, // ✅ valor correcto
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
    // 🔹 Contenedor general con dark para aplicar modo oscuro a toda la página
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <div className="h-[80px] md:h-[90px]"></div>

      <main className="flex flex-col lg:flex-row gap-8 p-6 lg:p-10">
        {/* Filtro lateral */}
        <aside className="lg:w-1/4 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md rounded-xl p-4 sticky top-24 h-fit">
          {isLoading ? (
            <SizeFilterSkeleton />
          ) : isError ? (
            <p className="text-red-500 dark:text-red-400 text-center">
              Error al cargar filtros
            </p>
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

export default MenPage;
