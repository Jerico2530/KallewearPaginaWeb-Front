import React, { useEffect, useState } from "react";
import { CreditCard, Wallet } from "lucide-react";
import { useCreateDetalleTarjeta } from "../../hooks/useDetalleTarjeta";
import { useCrearInfoTarjeta, useActualizarInfoTarjeta } from "../../hooks/useInfoTarjeta";
import { useMedioPagos } from "../../hooks/useMedioPago";
import useUserStore from "../../store/userStore";

const InfoTarjetaModal = ({ open, onClose, modo, tarjeta }) => {
  // Obtenemos usuarioId del store
  const usuarioId = useUserStore((state) => state.usuarioId);

  const [form, setForm] = useState({
    medioPagoId: "",
    numeroTarjeta: "",
    fechaVencimiento: "",
    cvv: "",
    estado: true,
  });

  // Lista de medios de pago
  const { data: mediosPago = [], isLoading: loadingMedios } = useMedioPagos();

  const createDetalleTarjeta = useCreateDetalleTarjeta();
  const createInfoTarjeta = useCrearInfoTarjeta();
  const updateInfoTarjeta = useActualizarInfoTarjeta();

  // Inicializamos formulario al abrir modal
  useEffect(() => {
    if (modo === "editar" && tarjeta) {
      setForm({
        medioPagoId: tarjeta.medioPagoId?.toString() || "",
        numeroTarjeta: tarjeta.numeroTarjeta || "",
        fechaVencimiento: tarjeta.fechaVencimiento || "",
        cvv: tarjeta.cvv || "",
        estado: tarjeta.estado,
      });
    } else {
      setForm({
        medioPagoId: "",
        numeroTarjeta: "",
        fechaVencimiento: "",
        cvv: "",
        estado: true,
      });
    }
  }, [modo, tarjeta]);

  if (!open) return null;

  const esBilletera = tarjeta?.tipoPago?.toLowerCase().includes("billetera");
  const bgColor = form.estado ? "bg-gray-100 dark:bg-gray-800" : "bg-gray-300 dark:bg-gray-700";
  const iconColor = form.estado ? "text-gray-800 dark:text-gray-200" : "text-gray-500";

  const handleGuardar = async () => {
    if (!form.medioPagoId || !form.numeroTarjeta || !form.fechaVencimiento || !form.cvv) {
      alert("Completa todos los campos antes de guardar.");
      return;
    }

    try {
      // 1️⃣ Crear detalleTarjeta
      const detalle = await createDetalleTarjeta.mutateAsync({
        numeroTarjeta: form.numeroTarjeta,
        fechaVencimiento: form.fechaVencimiento,
        cvv: form.cvv,
        estado: form.estado,
      });

      // 2️⃣ Crear o actualizar InfoTarjeta con usuarioId seguro
      const payload = {
        usuarioId: Number(usuarioId),           // ✅ ahora siempre existe
        medioPagoId: Number(form.medioPagoId),
        detalleTarjetaId: detalle.detalleTarjetaId,
        estado: form.estado,
      };

      if (modo === "crear") {
        await createInfoTarjeta.mutateAsync(payload);
      } else {
        await updateInfoTarjeta.mutateAsync({
          ...payload,
          infoTarjetaId: tarjeta.infoTarjetaId,
        });
      }

      onClose();
    } catch (error) {
      console.error("Error al guardar la tarjeta:", error);
      alert("Hubo un error al guardar la tarjeta.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 space-y-6">
        <h2 className="text-xl font-semibold">
          {modo === "crear" ? "Agregar tarjeta" : "Editar tarjeta"}
        </h2>

        {/* Tarjeta preview */}
        <div className={`rounded-2xl p-5 h-36 border border-gray-300 dark:border-gray-600 shadow-sm transition ${bgColor}`}>
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${bgColor} flex items-center justify-center`}>
              {esBilletera ? <Wallet size={22} className={iconColor} /> : <CreditCard size={22} className={iconColor} />}
            </div>
            <span className="text-xs font-medium text-gray-500">
              {mediosPago.find((m) => m.medioPagoId.toString() === form.medioPagoId)?.descripcionMedioPago ?? "Tipo de pago"}
            </span>
          </div>

          <div className="mt-6 space-y-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              {form.numeroTarjeta ? `•••• •••• •••• ${form.numeroTarjeta.slice(-4)}` : "Número de tarjeta"}
            </p>
            <p className={`text-xs font-medium ${form.estado ? "text-gray-600 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
              {form.estado ? "Activo" : "Inactivo"} | Vence {form.fechaVencimiento || "MM/AA"}
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Medio de pago</label>
          {loadingMedios ? (
            <p>Cargando medios de pago...</p>
          ) : (
            <select
              value={form.medioPagoId}
              onChange={(e) => setForm({ ...form, medioPagoId: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Selecciona un medio de pago</option>
              {mediosPago.map((m) => (
                <option key={m.medioPagoId} value={m.medioPagoId.toString()}>
                  {m.descripcionMedioPago}
                </option>
              ))}
            </select>
          )}

          <input
            type="text"
            placeholder="Número de tarjeta"
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
            value={form.numeroTarjeta}
            onChange={(e) => setForm({ ...form, numeroTarjeta: e.target.value })}
          />

          <input
            type="text"
            placeholder="MM/AA"
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
            value={form.fechaVencimiento}
            onChange={(e) => setForm({ ...form, fechaVencimiento: e.target.value })}
          />

          <input
            type="text"
            placeholder="CVV"
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
            value={form.cvv}
            onChange={(e) => setForm({ ...form, cvv: e.target.value })}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.checked })}
            />
            Activo
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoTarjetaModal;
