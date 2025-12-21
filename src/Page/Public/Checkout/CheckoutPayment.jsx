/**
 * CheckoutPayment.jsx
 *
 * Descripción del proyecto:
 * Este componente forma parte del flujo de checkout de una tienda en línea,
 * encargado de gestionar el pago de la orden creada por el usuario.
 *
 * Funcionalidades clave:
 * 1. Mostrar detalles de la orden y monto a pagar.
 * 2. Permitir seleccionar tipo de pago (tarjeta, wallet, etc.).
 * 3. Filtrar y seleccionar el medio de pago disponible según el tipo.
 * 4. Recoger datos de tarjeta si aplica.
 * 5. Crear el registro de pago y redirigir al detalle de la orden.
 *
 * Propósito:
 * Garantizar un pago seguro y confiable, integrando la lógica de selección de tipo
 * y medio de pago con validaciones básicas de datos.
 */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCreditCard, FaMobileAlt, FaWallet, FaLock } from "react-icons/fa";
import CheckoutLayout from "../Checkout/CheckoutLayout";
import { useTipoPagos } from "../../../hooks/useTipoPago";
import { useMedioPagos } from "../../../hooks/useMedioPago";
import { useCreatePago } from "../../../hooks/usePago";
import useUserStore from "../../../store/userStore";

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Obtener datos de la orden desde la navegación
  const { ordenId, monto } = location.state || {};
  // Datos del usuario
  const { usuarioId, nombreCompleto, correoElectronico } = useUserStore();
  // Validación inicial: redirigir si no hay orden
  if (!ordenId) {
    return (
      <p className="text-center mt-20 text-red-500">
        🚨 No se recibió una orden válida. Regresa al carrito.
      </p>
    );
  }

  const { data: tiposPago = [] } = useTipoPagos(); // Obtener tipos de pago disponible
  const { data: mediosPago = [] } = useMedioPagos(); // Obtener medios de pago disponibles
  const createPago = useCreatePago(); // Hook para crear pago en backend

  const [tipoSeleccionado, setTipoSeleccionado] = useState(null); // Tipo de pago seleccionado
  const [medioSeleccionado, setMedioSeleccionado] = useState(null); // Medio de pago seleccionado
  const [formData, setFormData] = useState({
    numero: "",
    vencimiento: "",
    cvv: "",
  }); // Datos de tarjeta

  // Iconos asociados a tipos de pago
  const iconos = {
    1: <FaCreditCard className="w-5 h-5 text-secondary" />,
    2: <FaCreditCard className="w-5 h-5 text-secondary" />,
    3: <FaMobileAlt className="w-5 h-5 text-secondary" />,
  };

  const handleTipo = (tipo) => {
    setTipoSeleccionado(tipo);
    setMedioSeleccionado(null);
    setFormData({ numero: "", vencimiento: "", cvv: "" }); // Reset formulario al cambiar tipo
  };

  const handleMedio = (medio) => setMedioSeleccionado(medio); // Guardar medio seleccionado
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Actualizar formulario

  // Confirmar pago y crear registro en backend
  const handleConfirm = async () => {
    if (!medioSeleccionado) return;

    const nuevoPago = {
      ordenId,
      usuarioId,
      medioPagoId: medioSeleccionado.medioPagoId,
      tipoPago: medioSeleccionado.descripcionTipoPago,
      descripcionMedioPago: medioSeleccionado.descripcionMedioPago,
      monto,
      codigoOperacion:
        tipoSeleccionado?.tipoPagoId === 3
          ? "WALLET-" + Date.now()
          : "CARD-" + formData.numero.slice(-4),
      estado: true,
      nombreCliente: nombreCompleto,
      correoCliente: correoElectronico,
    };

    try {
      const pagoCreado = await createPago.mutateAsync(nuevoPago);
      navigate("/ordenDetallado", {
        state: {
          pagoId: pagoCreado.pagoId,
          ordenId,
          medioPagoId: medioSeleccionado.medioPagoId,
        },
      });
    } catch (error) {
      console.error("Error al registrar el pago:", error);
    }
  };
  // Filtrar medios disponibles según el tipo seleccionado
  const mediosFiltrados = mediosPago.filter(
    (m) => m.tipoPagoId === tipoSeleccionado?.tipoPagoId
  );

  return (
    <CheckoutLayout step={4}>
      {/*  Contenedor centrado sin fondo de color */}
      <div className="flex justify-center items-center min-h-[calc(100vh-220px)] px-4">
        {/*  Card principal, misma estética que CheckoutDelivery */}
        <div className="w-full max-w-2xl bg-transparent border border-gray-300 dark:border-gray-700 rounded-3xl p-8 md:p-10 shadow-lg backdrop-blur-sm animate-fadeIn text-gray-900 dark:text-white">
          <h2 className="text-3xl font-bold text-center text-secondary mb-2">
            💳 Pago Seguro
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Estás pagando la orden{" "}
            <span className="font-semibold text-secondary">#{ordenId}</span> por{" "}
            <span className="font-bold text-green-600 dark:text-green-400">
              S/. {monto?.toFixed(2)}
            </span>
          </p>

          {/* Selección de tipo de pago */}
          <h3 className="text-lg font-semibold text-secondary mb-3">
            Selecciona el tipo de pago
          </h3>
          <div className="flex flex-col gap-3 mb-6">
            {tiposPago.map((tipo) => (
              <button
                key={tipo.tipoPagoId}
                onClick={() => handleTipo(tipo)}
                className={`flex items-center gap-3 w-full p-4 rounded-2xl border transition-all duration-300 ${
                  tipoSeleccionado?.tipoPagoId === tipo.tipoPagoId
                    ? "border-secondary bg-secondary/10 scale-[1.03]"
                    : "border-gray-300 dark:border-gray-700 hover:border-secondary/70"
                }`}
              >
                {iconos[tipo.tipoPagoId]}
                <span className="font-medium">{tipo.descripcionTipoPago}</span>
              </button>
            ))}
          </div>

          {/* Selección de medio de pago */}
          {tipoSeleccionado && (
            <>
              <h3 className="text-lg font-semibold text-secondary mb-3">
                Elige tu medio de pago
              </h3>
              <div className="flex flex-col gap-3 mb-6">
                {mediosFiltrados.map((medio) => (
                  <button
                    key={medio.medioPagoId}
                    onClick={() => handleMedio(medio)}
                    className={`flex items-center gap-3 w-full p-4 rounded-2xl border transition-all duration-300 ${
                      medioSeleccionado?.medioPagoId === medio.medioPagoId
                        ? "border-secondary bg-secondary/10 scale-[1.03]"
                        : "border-gray-300 dark:border-gray-700 hover:border-secondary/70"
                    }`}
                  >
                    {iconos[medio.tipoPagoId] || (
                      <FaWallet className="w-5 h-5 text-secondary" />
                    )}
                    <span className="font-medium">
                      {medio.descripcionMedioPago}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Formulario para tarjeta de crédito/débito */}
          {medioSeleccionado && tipoSeleccionado?.tipoPagoId !== 3 && (
            <div className="mb-6 space-y-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-5 rounded-2xl shadow-inner">
              <h3 className="text-base font-semibold text-secondary mb-2">
                Detalles de la Tarjeta
              </h3>
              <input
                type="text"
                name="numero"
                placeholder="Número de tarjeta"
                value={formData.numero}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-secondary transition"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  name="vencimiento"
                  placeholder="MM/AA"
                  value={formData.vencimiento}
                  onChange={handleChange}
                  className="w-1/2 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-secondary transition"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleChange}
                  className="w-1/2 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-secondary transition"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                <FaLock className="text-secondary" />
                <p>Tus datos están seguros y encriptados.</p>
              </div>
            </div>
          )}

          {/* Mensaje para Wallet */}
          {medioSeleccionado && tipoSeleccionado?.tipoPagoId === 3 && (
            <div className="mb-6 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 animate-fadeIn">
              <p>
                Serás redirigido a{" "}
                <strong className="text-secondary">
                  {medioSeleccionado.descripcionMedioPago}
                </strong>{" "}
                para completar el pago.
              </p>
            </div>
          )}

          {/* Botón Confirmar pago */}
          <button
            disabled={
              !medioSeleccionado ||
              (tipoSeleccionado?.tipoPagoId !== 3 && !formData.numero)
            }
            onClick={handleConfirm}
            className={`w-full py-4 rounded-2xl font-semibold text-lg tracking-wide shadow-md transition-all duration-300 ${
              medioSeleccionado
                ? "bg-secondary text-white hover:opacity-90 hover:scale-[1.03]"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            Confirmar Pago 💰
          </button>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default CheckoutPayment;
