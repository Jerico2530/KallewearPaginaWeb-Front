/**
 * CartTotal.jsx
 *
 * Permite al usuario revisar su orden antes de proceder al pago, garantizando transparencia
 * y seguridad en la experiencia de compra.
 *
 * Funcionalidades clave:
 * 1. Obtención de la orden por ID mediante un hook personalizado useOrdenById.
 * 2. Visualización de los datos del cliente y detalles de la orden.
 * 3. Listado dinámico de productos dentro del carrito con subtotales.
 * 4. Navegación hacia la página de pago con validación de orden.
 * 5. Manejo de estados de carga y error de forma clara y profesional.
 */
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrdenById } from "../../../hooks/useOrden";
import CheckoutLayout from "../Checkout/CheckoutLayout";

const CartTotal = () => {
  // Obtiene el ID de la orden desde la URL
  const { ordenId } = useParams();
  const navigate = useNavigate();
  // Hook personalizado para obtener la orden
  const { data: ordenData, isLoading, isError } = useOrdenById(ordenId);

  const orden = ordenData?.resultado;

  // Función que navega a la página de pago, pasando la orden y el monto total
  const goToPayment = () => {
    if (!ordenId) {
      console.warn("🚨 No hay ordenId válido. No se puede continuar al pago.");
      return;
    }
    navigate("/checkoutPayment", { state: { ordenId, monto: orden.total } });
  };
  // Estado de carga: muestra un mensaje mientras se obtiene la orden
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">
          Cargando orden...
        </p>
      </div>
    );

  // Manejo de error o caso de orden no encontrada
  if (isError || !orden)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-red-500 font-semibold">
          No se pudo cargar la orden.
        </p>
      </div>
    );

  return (
    <CheckoutLayout step={3}>
      {/* Contenedor principal que organiza la sección de resumen de la orden */}
      <div
        className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-10 
        bg-transparent border border-gray-300 dark:border-gray-700 rounded-3xl 
        p-8 md:p-10 shadow-lg backdrop-blur-sm 
        transition-all duration-500 hover:shadow-xl animate-fadeIn"
      >
        {/* Sección izquierda: detalles de la orden y del cliente */}
        <div className="w-full md:w-7/12 flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            🧾 Orden #{orden.ordenId}
          </h2>

          {/* Información general de la orden */}
          <div className="grid grid-cols-1 gap-3 text-gray-700 dark:text-gray-300 text-base">
            <div>
              <span className="font-semibold">👤 Nombre:</span>{" "}
              {orden.nombreCompleto} {orden.apellidoCompleto}
            </div>
            <div>
              <span className="font-semibold">🪪 DNI:</span> {orden.dni}
            </div>
            <div>
              <span className="font-semibold">🚚 Método de entrega:</span>{" "}
              <span className="uppercase tracking-wide font-semibold">
                {orden.metodoEntrega}
              </span>
            </div>
            <div>
              <span className="font-semibold">🏬 Sucursal:</span>{" "}
              {orden.locales ?? "N/A"}
            </div>
            <div>
              <span className="font-semibold">📍 Dirección:</span>{" "}
              {orden.descripcion ??
                `${orden.departamento}, ${orden.provincia}, ${orden.distrito}, ${orden.via} ${orden.numero}`}
            </div>
            <div>
              <span className="font-semibold">💰 Total:</span>{" "}
              <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                S/ {orden.total?.toFixed(2) ?? "0.00"}
              </span>
            </div>
            <div>
              <span className="font-semibold">🕒 Fecha:</span>{" "}
              {new Date(orden.fechaRegistro).toLocaleString()}
            </div>
          </div>
          {/* Recomendación para el usuario antes de confirmar el pago */}
          <div className="mt-6 p-5 rounded-xl bg-gray-100 dark:bg-gray-700 text-base text-gray-600 dark:text-gray-300">
            <p className="leading-relaxed">
              💡 <strong>Consejo:</strong> Verifica bien tus productos antes de
              proceder al pago. Una vez confirmes, tu orden se procesará
              automáticamente.
            </p>
          </div>
        </div>

        {/* Sección derecha: listado de productos del carrito */}
        <div className="w-full md:w-5/12 flex flex-col gap-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            🛍️ Tus Productos
          </h3>

          {orden.carritoCompras?.length > 0 ? (
            <div
              className="flex flex-col gap-5 max-h-[600px] overflow-y-auto 
              pr-3 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600"
            >
              {orden.carritoCompras.map((item, i) => (
                <div
                  key={item.carritoId}
                  className="flex items-center gap-5 bg-gray-100 dark:bg-gray-700 
                  border border-gray-300 dark:border-gray-600
                  p-5 rounded-2xl shadow-md hover:shadow-lg 
                  transition-all duration-300 hover:scale-[1.02] animate-slideIn"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-24 h-24 object-cover rounded-xl shadow-md hover:rotate-1 transition-transform"
                  />
                  <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-semibold text-gray-900 dark:text-white text-base">
                      {item.nombre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {item.descripcion}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                      <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-md">
                        <strong>Talla:</strong> {item.tipoTalla}
                      </span>
                      <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-md">
                        <strong>Cant:</strong> {item.cantidad}
                      </span>
                      <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-md">
                        <strong>Precio:</strong> S/{" "}
                        {item.precioUnitario.toFixed(2)}
                      </span>
                      <span className="bg-green-200 dark:bg-green-600 text-green-800 dark:text-green-100 px-2 py-1 rounded-md font-semibold">
                        Subtotal: S/ {item.subTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No hay productos en el carrito.
            </p>
          )}
        </div>
      </div>

      {/* Botón para confirmar pago, ejecuta la función goToPayment */}
      <div className="w-full max-w-6xl mx-auto mt-10 flex justify-center">
        <button
          onClick={goToPayment}
          className="w-full md:w-auto bg-gradient-to-r from-secondary to-gray-900 
          hover:from-gray-900 hover:to-secondary 
          text-white font-semibold py-3 px-12 rounded-2xl 
          shadow-lg hover:shadow-2xl transform hover:scale-[1.04] 
          transition-all duration-300 uppercase tracking-wide"
        >
          Confirmar Pago 💳
        </button>
      </div>
    </CheckoutLayout>
  );
};

export default CartTotal;
