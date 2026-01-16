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
  const { pagoId, ordenId } = location.state || {};

  const { data: ordenResponse, isLoading: loadingOrden } = useOrdenById(ordenId);
  const { data: pagoResponse, isLoading: loadingPago } = usePagoById(pagoId);

  if (!pagoId || !ordenId) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
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

  if (loadingOrden || loadingPago) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Cargando datos de la orden...</p>
      </div>
    );
  }

  const orden = ordenResponse?.resultado;
  const pago = pagoResponse?.resultado;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 pt-36 pb-10 md:pt-40">
      {/* Banner de confirmación */}
      <div className="flex flex-col items-center mb-12 animate-fadeIn">
        <FaCheckCircle className="text-green-500 text-9xl mb-5 animate-bounce" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 text-center">
          ¡Pedido Confirmado!
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-center max-w-lg md:max-w-xl">
          Gracias por su compra. Su pedido ha sido registrado correctamente y se procesará pronto.
        </p>
      </div>

      {/* Contenedor principal */}
      <div className="bg-white dark:bg-gray-800 w-full max-w-6xl rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-10 transition-all duration-500 hover:shadow-3xl">
        {/* IZQUIERDA: Info Orden y Cliente */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            🧾 Orden {orden.ordenId}
          </h2>

          <div className="grid grid-cols-1 gap-3 text-gray-700 dark:text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <FaUser className="text-purple-500" />
              <span className="font-semibold">Cliente:</span> {orden.nombreCompleto} {orden.apellidoCompleto}
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              <span className="font-semibold">DNI:</span> {orden.dni}
            </div>
            <div className="flex items-center gap-2">
              <FaStore className="text-indigo-500" />
              <span className="font-semibold">Sucursal:</span> {orden.locales ?? "N/A"}
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              <span className="font-semibold">Dirección:</span> {orden.descripcion ?? "Retiro en tienda"}
            </div>
            <div className="flex items-center gap-2">
              <FaMoneyBillWave className="text-green-500" />
              <span className="font-semibold">Total:</span>
              <span className="text-green-600 dark:text-green-400 font-bold">
                S/ {orden.total?.toFixed(2) ?? "0.00"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              <span className="font-semibold">Fecha:</span> {new Date(orden.fechaRegistro).toLocaleString()}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300">
            💡 Revisa los productos antes de continuar. Una vez confirmado, tu orden se procesará.
          </div>
        </div>

        {/* DERECHA: Productos */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            🛍️ Productos en tu pedido
          </h3>

          {orden.carritoCompras?.length > 0 ? (
            <div className="flex flex-col gap-5 max-h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
              {orden.carritoCompras.map((item, i) => (
                <div
                  key={item.carritoId}
                  className="flex items-center gap-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-20 h-20 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1 text-sm text-gray-700 dark:text-gray-200">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">{item.nombre}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">{item.descripcion}</p>
                    <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                      <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-md">
                        <strong>Talla:</strong> {item.tipoTalla}
                      </span>
                      <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-md">
                        <strong>Cant:</strong> {item.cantidad}
                      </span>
                      <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-md">
                        <strong>Precio:</strong> S/ {item.precioUnitario.toFixed(2)}
                      </span>
                      <span className="bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 px-2 py-1 rounded-md font-semibold">
                        Subtotal: S/ {item.subTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-300">
              No hay productos en el carrito.
            </p>
          )}
        </div>
      </div>

      {/* Botón Volver al Inicio */}
      <div className="w-full max-w-6xl mt-12 flex justify-center">
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
