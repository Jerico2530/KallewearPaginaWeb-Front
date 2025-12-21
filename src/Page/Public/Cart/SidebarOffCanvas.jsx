/**
 * Componente SidebarOffCanvas - Carrito Lateral
 *
 * Propósito del componente:
 *   - Mostrar el carrito de compras del usuario en un panel lateral interactivo.
 *   - Permitir ver, editar y eliminar productos directamente desde el carrito.
 *   - Mostrar el total del carrito y acciones rápidas como vaciar o ir al carrito completo.
 *
 * Funcionalidades clave del proyecto:
 *   - Integración con store global para control de visibilidad del carrito.
 *   - Obtención dinámica de datos del carrito mediante hooks personalizados.
 *   - Edición en línea de cantidades de productos con validación de stock.
 *   - Animaciones fluidas usando Framer Motion para apertura/cierre y renderizado de items.
 *   - Diseño responsivo y compatible con modo oscuro.
 */
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { IoRemoveCircleOutline, IoAddCircleOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import useOffcanvasStore from "../../../store/offcanvasStore";
import useUserStore from "../../../store/userStore";
import {
  useCarritoComprasUsuario,
  useEliminarCarritoCompras,
  useVaciarCarritoCompras,
  usePatchCarritoCompras,
} from "../../../hooks/useCarrito";

const SidebarOffCanvas = () => {
  // 🔹 Estado global del carrito (visible / toggle)
  const { carritoVisible, toggleCarrito, setCarritoVisible } =
    useOffcanvasStore();
  // 🔹 Hook de navegación para redireccionar al carrito completo
  const navigate = useNavigate();
  // 🔹 Obtener ID del usuario actual
  const usuarioId = useUserStore((state) => state.usuarioId);
  // 🔹 Obtener datos del carrito del usuario
  const { data: carritoData = { items: [], totalCarrito: 0 } } =
    useCarritoComprasUsuario(usuarioId);

  const { items: carritoApi, totalCarrito } = carritoData;
  // 🔹 Mutaciones para eliminar un item, vaciar carrito y actualizar cantidades
  const { mutate: eliminarItem } = useEliminarCarritoCompras(usuarioId);
  const { mutate: vaciarCarrito } = useVaciarCarritoCompras(usuarioId);
  const { mutate: patchCarrito } = usePatchCarritoCompras(usuarioId);

  return (
    <AnimatePresence>
      {carritoVisible && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-gray-900 z-[9999] shadow-2xl flex flex-col"
        >
          {/* HEADER: título del carrito y botón cerrar */}
          <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-xl font-bold text-gray-900 dark:text-white">
              Mi carrito de compras
            </h5>

            <button
              onClick={toggleCarrito} // 🔹 cerrar carrito
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 text-3xl transition-transform duration-200 hover:scale-110"
            >
              &times;
            </button>
          </div>

          {/* LISTADO */}
          <div className="p-4 overflow-y-auto flex-1">
            {carritoApi.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <FaShoppingCart size={40} className="mb-4 animate-bounce" />
                <p className="text-center text-lg mt-2">
                  Tu carrito está vacío
                </p>
              </div>
            ) : (
              carritoApi.map((item) => (
                <motion.div
                  key={item.carritoId}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-4 border-b border-gray-200 dark:border-gray-700 py-4 items-center rounded-xl p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  {/* Imagen */}
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-20 h-20 object-contain rounded-lg shadow-md"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {item.nombre}
                    </h4>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.descripcion}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Talla: {item.tipoTalla}
                    </p>

                    {/* Controles de cantidad */}
                    <div className="mt-2 flex items-center gap-2">
                      {/* Restar */}
                      <button
                        onClick={() => {
                          if (item.cantidad > 1) {
                            patchCarrito({
                              carritoId: item.carritoId,
                              operaciones: [
                                {
                                  operationType: 2,
                                  path: "cantidad",
                                  value: item.cantidad - 1,
                                },
                              ],
                            });
                          } else {
                            eliminarItem(item.carritoId);
                          }
                        }}
                        className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition"
                      >
                        <IoRemoveCircleOutline size={24} />
                      </button>

                      {/* Cantidad visual */}
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full font-medium">
                        {item.cantidad}
                      </span>

                      {/* Sumar */}
                      <button
                        disabled={item.cantidad >= item.stockDisponible}
                        onClick={() =>
                          patchCarrito({
                            carritoId: item.carritoId,
                            operaciones: [
                              {
                                operationType: 2,
                                path: "cantidad",
                                value: item.cantidad + 1,
                              },
                            ],
                          })
                        }
                        className={`transition ${
                          item.cantidad >= item.stockDisponible
                            ? "opacity-40 cursor-not-allowed"
                            : "text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
                        }`}
                      >
                        <IoAddCircleOutline size={24} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      S/. {item.subTotal?.toFixed(2)}
                    </p>
                  </div>

                  {/* Eliminar */}
                  <button
                    onClick={() => eliminarItem(item.carritoId)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <RiDeleteBin6Line size={22} />
                  </button>
                </motion.div>
              ))
            )}
          </div>

          {/* FOOTER: total y acciones */}
          <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total:
              </span>
              <span className="text-2xl font-bold text-orange-500">
                S/. {totalCarrito.toFixed(2)}
              </span>
            </div>

            {/* Botón vaciar carrito */}
            <button
              onClick={() => vaciarCarrito(usuarioId)}
              disabled={carritoApi.length === 0}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
            >
              Vaciar carrito
            </button>
            {/* Navegar al carrito completo */}
            <div
              onClick={() => {
                toggleCarrito();
                navigate("/CarroPrincipal");
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg hover:scale-105 transition cursor-pointer shadow-lg"
            >
              <FaShoppingCart /> Ver carrito completo
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidebarOffCanvas;
