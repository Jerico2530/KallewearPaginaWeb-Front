import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Plus, ChevronDown, Info, Wallet , ChevronLeft  } from "lucide-react";
import CheckoutLayout from "../Checkout/CheckoutLayout";
import { useTipoPagos } from "../../../hooks/useTipoPago";
import { useMedioPagos } from "../../../hooks/useMedioPago";
import { useInfoTarjetasByUsuario } from "../../../hooks/useInfoTarjeta";
import { useCreatePago } from "../../../hooks/usePago";
import useUserStore from "../../../store/userStore";
import { useQueryClient } from "@tanstack/react-query";

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { ordenId, monto } = location.state || {};
  const { usuarioId } = useUserStore();

  if (!ordenId) {
    return (
      <p className="text-center mt-20 text-red-500 dark:text-red-400">
        🚨 No se recibió una orden válida. Regresa al carrito.
      </p>
    );
  }

  const { data: tiposPago = [] } = useTipoPagos();
  const { data: mediosPago = [] } = useMedioPagos();
  const { data: infoTarjetas = [] } = useInfoTarjetasByUsuario(usuarioId);
  const createPago = useCreatePago();

  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [medioSeleccionado, setMedioSeleccionado] = useState(null);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);
  const [agregandoNuevaTarjeta, setAgregandoNuevaTarjeta] = useState(false);
  const [formNuevaTarjeta, setFormNuevaTarjeta] = useState({
    numero: "",
    vencimiento: "",
    cvv: "",
  });

  useEffect(() => {
    setAgregandoNuevaTarjeta(infoTarjetas.length === 0);
  }, [infoTarjetas]);

  const handleTipo = (tipo) => {
    setTipoSeleccionado(tipo);
    setMedioSeleccionado(null);
  };

  const handleAgregarNuevaTarjeta = () => {
    setTarjetaSeleccionada(null);
    setTipoSeleccionado(null);
    setMedioSeleccionado(null);
    setAgregandoNuevaTarjeta(true);
  };

  const handleMedio = (medio) => setMedioSeleccionado(medio);
  const handleTarjeta = (tarjeta) => {
    setTarjetaSeleccionada(tarjeta);
    setAgregandoNuevaTarjeta(false);
    setTipoSeleccionado({ tipoPagoId: tarjeta.tipoPagoId });
  };

  const handleChangeNuevaTarjeta = (e) => {
    setFormNuevaTarjeta({
      ...formNuevaTarjeta,
      [e.target.name]: e.target.value,
    });
  };

  const mediosFiltrados = mediosPago.filter(
    (m) => m.tipoPagoId === tipoSeleccionado?.tipoPagoId
  );

  const handleConfirm = async () => {
    let payload;

    if (tarjetaSeleccionada) {
      payload = {
        ordenId,
        infoTarjetaId: tarjetaSeleccionada.infoTarjetaId,
        medioPagoId: tarjetaSeleccionada.medioPagoId,
        codigoOperacion: "CARD-" + Date.now(),
        estado: true,
      };
    } else {
      if (!medioSeleccionado) {
        alert("Selecciona un medio de pago");
        return;
      }
      payload = {
        ordenId,
        infoTarjetaId: 0,
        medioPagoId: medioSeleccionado.medioPagoId,
        codigoOperacion: "CARD-" + Date.now(),
        estado: true,
        nuevaTarjeta: {
          numeroTarjeta: formNuevaTarjeta.numero,
          fechaVencimiento: formNuevaTarjeta.vencimiento,
          cvv: formNuevaTarjeta.cvv,
          estado: true,
        },
      };
    }

    try {
      const pagoCreado = await createPago.mutateAsync(payload);

      await queryClient.cancelQueries({
        queryKey: ["carritoCompra", usuarioId],
      });
      queryClient.removeQueries({ queryKey: ["carritoCompra", usuarioId] });
      queryClient.invalidateQueries({ queryKey: ["carritoCompra", usuarioId] });
      queryClient.invalidateQueries({ queryKey: ["productoTallas"] });

      navigate("/ordenDetallado", {
        replace: true,
        state: { pagoId: pagoCreado.pagoId, ordenId },
      });
    } catch {}
  };

  return (
    <CheckoutLayout step={4}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Resumen de Orden */}
        {/* Resumen de Orden Profesional */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl mb-6">
          {/* Ícono de Orden */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-xl">
              <CreditCard
                className="text-blue-600 dark:text-blue-400"
                size={28}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Orden ID
              </span>
              <span className="text-gray-900 dark:text-gray-100 font-bold text-lg">
                {ordenId}
              </span>
            </div>
          </div>

          {/* Monto Total */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 dark:bg-green-900 rounded-xl">
              <span className="text-green-600 dark:text-green-400 font-bold text-xl">
                S/.
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Monto Total
              </span>
              <span className="text-gray-900 dark:text-gray-100 font-bold text-lg">
                {monto?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Estado Orden */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900 rounded-xl">
              <span className="text-yellow-600 dark:text-yellow-400 font-bold text-xl">
                💳
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Estado
              </span>
              <span className="text-gray-900 dark:text-gray-100 font-bold text-lg">
                Pendiente
              </span>
            </div>
          </div>
        </div>

        {/* Tarjetas Guardadas */}
        {infoTarjetas.length > 0 && !agregandoNuevaTarjeta && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
              Tarjetas guardadas
            </h3>
            {infoTarjetas.map((t) => (
              <div
                key={t.infoTarjetaId}
                onClick={() => handleTarjeta(t)}
                className={`p-4 rounded-xl cursor-pointer border-2 transition-all
                  ${
                    tarjetaSeleccionada?.infoTarjetaId === t.infoTarjetaId
                      ? "border-blue-600 ring-2 ring-blue-50 dark:ring-blue-800"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  } 
                  bg-white dark:bg-gray-900 shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                      <CreditCard
                        className="text-blue-600 dark:text-blue-400"
                        size={20}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200">
                        {t.descripcionMedioPago} ••••{" "}
                        {t.numeroTarjeta.slice(-4)}
                      </p>
                    </div>
                  </div>
                  {tarjetaSeleccionada?.infoTarjetaId === t.infoTarjetaId && (
                    <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={handleAgregarNuevaTarjeta}
              className="w-full mt-2 py-3 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              <Plus size={18} />
              Agregar tarjeta o Gift Card
            </button>
          </div>
        )}

        {/* Nueva Tarjeta */}
        {agregandoNuevaTarjeta && (
          <div className="mt-6 space-y-6">
            {/* Botón regresar a tarjetas guardadas */}
            <div className="flex justify-start">
              <button
                onClick={() => setAgregandoNuevaTarjeta(false)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                <ChevronLeft size={16} />
                Regresar a tarjetas guardadas
              </button>
            </div>

            {/* ===== MÉTODO DE PAGO ===== */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                Método de pago
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tiposPago.map((tipo) => (
                  <button
                    key={tipo.tipoPagoId}
                    onClick={() => handleTipo(tipo)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left shadow-sm
              ${
                tipoSeleccionado?.tipoPagoId === tipo.tipoPagoId
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900 shadow-md"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
                  >
                    {tipo.descripcionTipoPago}
                  </button>
                ))}
              </div>
            </div>

            {/* ===== TIPO DE TARJETA ===== */}
            {tipoSeleccionado && mediosFiltrados.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Tipo de tarjeta
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mediosFiltrados.map((medio) => (
                    <button
                      key={medio.medioPagoId}
                      onClick={() => handleMedio(medio)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left shadow-sm
                ${
                  medioSeleccionado?.medioPagoId === medio.medioPagoId
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                    >
                      {medio.descripcionMedioPago}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ===== DATOS DE LA TARJETA ===== */}
            {medioSeleccionado && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Datos de la tarjeta
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    name="numero"
                    placeholder="Número de tarjeta"
                    value={formNuevaTarjeta.numero}
                    onChange={handleChangeNuevaTarjeta}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    name="vencimiento"
                    placeholder="MM/AA"
                    value={formNuevaTarjeta.vencimiento}
                    onChange={handleChangeNuevaTarjeta}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    name="cvv"
                    placeholder="CVV"
                    value={formNuevaTarjeta.cvv}
                    onChange={handleChangeNuevaTarjeta}
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmar Pago */}
        <button
          onClick={handleConfirm}
          className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          Confirmar Pago 💰
        </button>
      </div>
    </CheckoutLayout>
  );
};

export default CheckoutPayment;
