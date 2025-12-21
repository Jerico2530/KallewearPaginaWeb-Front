/**
 * ConfirmacionPedido.jsx
 *
 * Descripción del proyecto:
 * Componente que muestra la confirmación de un pedido tras completar el proceso de checkout.
 * Forma parte de un sistema de e-commerce que gestiona órdenes, pagos y envíos.
 *
 * Funcionalidades clave:
 * 1. Mostrar detalles de la orden y del cliente.
 * 2. Mostrar los productos comprados con información completa (talla, cantidad, precio, subtotal).
 * 3. Resumen de pago y dirección o sucursal seleccionada.
 * 4. Botón para volver al inicio, completando el flujo de compra.
 *
 * Propósito:
 * Brindar al usuario una confirmación clara y visual de su compra, reforzando la confianza
 * y cerrando el ciclo de la experiencia de compra de manera profesional.
 */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaMoneyBillWave,
  FaStore,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useOrdenById } from "../../../hooks/useOrden";
import { usePagoById } from "../../../hooks/usePago";

const ConfirmacionPedido = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pagoId, ordenId, medioPagoId: medioPagoState } = location.state || {};

  // Obtener datos de la orden y del pago
  const { data: ordenResponse, isLoading: loadingOrden } =
    useOrdenById(ordenId);
  const { data: pagoResponse, isLoading: loadingPago } = usePagoById(pagoId);

  // Validación básica: si no hay datos, mostrar mensaje y opción de regresar
  if (!pagoId || !ordenId) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <p className="text-red-500 text-lg mb-4">
          ❌ No se recibieron datos de la orden/pago.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  // Mostrar indicador de carga mientras se obtienen los datos
  if (loadingOrden || loadingPago) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Cargando datos de la orden...</p>
      </div>
    );
  }

  const orden = ordenResponse?.resultado;
  const pago = pagoResponse?.resultado;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 py-10">
      {/* Espacio superior para navbar fijo */}
      <div className="h-[80px] md:h-[100px]" />
      {/* Banner de confirmación */}
      <div className="flex flex-col items-center mb-8">
        <FaCheckCircle className="text-green-500 text-8xl animate-bounce mb-3" />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          ¡Pedido Confirmado!
        </h1>
        <p className="text-gray-600 text-center max-w-xl">
          Gracias por su compra. Su pedido ha sido registrado correctamente.
        </p>
      </div>

      {/* Contenedor principal de detalles de orden */}
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-10 transition-all duration-500 hover:shadow-3xl animate-fadeIn">
        {/* Izquierda: Info de Orden y Cliente */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            🧾 Orden #{orden.ordenId}
          </h2>

          <div className="grid grid-cols-1 gap-3 text-gray-700 text-sm">
            <div className="flex items-center gap-2">
              <FaUser className="text-purple-500" />{" "}
              <span className="font-semibold">Nombre:</span>{" "}
              {orden.nombreCompleto} {orden.apellidoCompleto}
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />{" "}
              <span className="font-semibold">DNI:</span> {orden.dni}
            </div>
            <div className="flex items-center gap-2">
              <FaStore className="text-indigo-500" />{" "}
              <span className="font-semibold">Sucursal:</span>{" "}
              {orden.locales ?? "N/A"}
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              <span className="font-semibold">Dirección:</span>{" "}
              {orden.descripcion ?? "Retiro en tienda"}
            </div>
            <div className="flex items-center gap-2">
              <FaMoneyBillWave className="text-green-500" />{" "}
              <span className="font-semibold">Total:</span>{" "}
              <span className="text-green-600 font-bold">
                S/ {orden.total?.toFixed(2) ?? "0.00"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />{" "}
              <span className="font-semibold">Fecha:</span>{" "}
              {new Date(orden.fechaRegistro).toLocaleString()}
            </div>
          </div>

          {/* Info complementaria */}
          <div className="mt-6 p-4 rounded-xl bg-gray-100 text-sm text-gray-600">
            💡 Revisa bien los productos antes de continuar. Una vez confirmado,
            tu orden se procesará para envío o retiro.
          </div>
        </div>

        {/* Derecha: Productos */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            🛍️ Tus Productos
          </h3>

          {orden.carritoCompras?.length > 0 ? (
            <div className="flex flex-col gap-5 max-h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400">
              {orden.carritoCompras.map((item, i) => (
                <div
                  key={item.carritoId}
                  className="flex items-center gap-4 bg-gray-100 p-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-slideIn"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-20 h-20 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900 text-base">
                      {item.nombre}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      {item.descripcion}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                      <span className="bg-gray-200 px-2 py-1 rounded-md">
                        <strong>Talla:</strong> {item.tipoTalla}
                      </span>
                      <span className="bg-gray-200 px-2 py-1 rounded-md">
                        <strong>Cant:</strong> {item.cantidad}
                      </span>
                      <span className="bg-gray-200 px-2 py-1 rounded-md">
                        <strong>Precio:</strong> S/{" "}
                        {item.precioUnitario.toFixed(2)}
                      </span>
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded-md font-semibold">
                        Subtotal: S/ {item.subTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No hay productos en el carrito.
            </p>
          )}
        </div>
      </div>

      {/* Botón de acción */}
      <div className="w-full max-w-5xl mt-10 flex justify-center">
        <button
          onClick={() => navigate("/")}
          className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-900 hover:from-indigo-900 hover:to-purple-600 text-white font-semibold py-3 px-10 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.04] transition-all duration-300 uppercase tracking-wide"
        >
          Volver al Inicio 🏠
        </button>
      </div>
    </div>
  );
};

export default ConfirmacionPedido;
