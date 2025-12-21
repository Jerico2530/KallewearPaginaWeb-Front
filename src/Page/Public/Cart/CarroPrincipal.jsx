/**
 * Página Principal del Carrito de Compras
 *
 * Propósito del componente:
 *   - Mostrar el carrito de compras del usuario conectado con sus productos seleccionados.
 *   - Permitir modificar cantidades, eliminar productos y proceder al checkout.
 *
 * Funcionalidades clave del proyecto:
 *   - Integración con hooks personalizados para obtener, actualizar y eliminar items del carrito.
 *   - Renderizado condicional para estados de carga, error o carrito vacío.
 *   - Control de cantidad con validaciones y actualización en tiempo real.
 *   - Resumen del carrito con total calculado y botón para continuar a checkout.
 *   - Compatible con modo oscuro y diseño responsivo.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTags, FaShoppingBag, FaTrash } from "react-icons/fa";
import useUserStore from "../../../store/userStore";
import {
  useCarritoComprasUsuario,
  useEliminarCarritoCompras,
  usePatchCarritoCompras,
} from "../../../hooks/useCarrito";

const CarroPrincipal = () => {
  const navigate = useNavigate();
  // Obtener ID de usuario desde el store globa
  const usuarioId = useUserStore((state) => state.usuarioId);
  // Hook para obtener carrito de compras del usuario
  const {
    data: carritoData = { items: [], totalCarrito: 0 },
    isLoading,
    isError,
  } = useCarritoComprasUsuario(usuarioId);

  const { items: cart, totalCarrito } = carritoData;
  // Hooks para actualizar o eliminar items del carrito
  const patchCarrito = usePatchCarritoCompras(usuarioId);
  const eliminarCarrito = useEliminarCarritoCompras(usuarioId);

  // Mostrar pantalla de carga mientras se obtiene el carrito
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
          Cargando carrito...
        </p>
      </div>
    );
  }
  // Mostrar mensaje si el carrito está vacío o hubo un error
  if (isError || !cart.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
        <FaShoppingBag className="text-5xl text-gray-400 dark:text-gray-600 mb-4 animate-bounce" />
        <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">
          Tu carrito está vacío.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-secondary text-white rounded-xl shadow-md hover:bg-black transition font-semibold"
        >
          Ir a comprar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Espacio superior fijo */}
      <div className="h-[70px] md:h-[90px]" />
      <main className="flex-grow max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos en el carrito */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <FaShoppingBag className="text-secondary" /> Tu carrito (
              {cart.length})
            </h2>

            <div className="space-y-6">
              {cart.map((p, i) => (
                <div
                  key={p.carritoId}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b pb-6 last:border-none animate-slideIn"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Imagen del producto */}
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="w-28 h-28 object-cover rounded-xl shadow-md hover:scale-105 transition-transform"
                  />

                  {/* Información y controles del producto */}
                  <div className="flex-1 w-full">
                    {/* Nombre y talla */}
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {p.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Talla: {p.tipoTalla || "N/A"}
                    </p>

                    {/* Subtotal */}
                    <div className="flex items-center mt-3">
                      <span className="text-red-500 font-bold text-lg">
                        S/ {p.subTotal?.toFixed(2) ?? "0.00"}
                      </span>
                    </div>

                    {/* Controles de cantidad y eliminar */}
                    <div className="flex items-center mt-4 gap-3">
                      {/* Controles */}
                      <div className="flex items-center rounded-lg border overflow-hidden shadow-sm">
                        {/* Restar */}
                        <button
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                          onClick={() => {
                            if (p.cantidad > 1) {
                              patchCarrito.mutate({
                                carritoId: p.carritoId,
                                operaciones: [
                                  {
                                    operationType: 2,
                                    path: "cantidad",
                                    value: p.cantidad - 1,
                                  },
                                ],
                              });
                            } else {
                              eliminarCarrito.mutate(p.carritoId);
                            }
                          }}
                        >
                          -
                        </button>

                        {/* Cantidad actual */}
                        <span className="px-4 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 font-semibold">
                          {p.cantidad}
                        </span>

                        {/* Sumar */}
                        <button
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                          onClick={() =>
                            patchCarrito.mutate({
                              carritoId: p.carritoId,
                              operaciones: [
                                {
                                  operationType: 2,
                                  path: "cantidad",
                                  value: p.cantidad + 1,
                                },
                              ],
                            })
                          }
                        >
                          +
                        </button>
                      </div>

                      {/* Botón eliminar producto */}
                      <button
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700 transition shadow"
                        onClick={() => eliminarCarrito.mutate(p.carritoId)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen del carrito */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 h-fit animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Resumen del Carrito
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Productos </span>
                <span>S/ {totalCarrito.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Descuentos</span>
                <span>-S/ 0.00</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-3 mt-3 text-gray-900 dark:text-white text-lg">
                <span>Total:</span>
                <span>S/ {totalCarrito.toFixed(2)}</span>
              </div>
            </div>

            {/* Botón continuar compra */}
            <button
              onClick={() => navigate("/checkoutCart")}
              className="w-full flex items-center justify-center gap-2 bg-secondary text-white py-3 mt-6 rounded-xl shadow-lg hover:bg-black hover:scale-[1.02] transition-transform text-lg font-semibold"
            >
              <FaTags className="text-xl" /> Continuar compra
            </button>

            {/* Información adicional de pago */}
            <div className="mt-5 p-4 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-center rounded-xl text-sm font-medium shadow-inner">
              ¡Ahora puedes pagar con <span className="font-bold">Yape</span>!
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CarroPrincipal;
