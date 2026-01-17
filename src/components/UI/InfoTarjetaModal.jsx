import React, { useEffect, useState } from "react";
import { CreditCard, Wallet } from "lucide-react";
import { useMedioPagos } from "../../hooks/useMedioPago";

const InfoTarjetaModal = ({
  open,
  onClose,
  modo,
  tarjeta,
  onSubmit,
  errores,
}) => {
  const [form, setForm] = useState({
    medioPagoId: "",
    numeroTarjeta: "",
    fechaVencimiento: "",
    cvv: "",
    estado: true,
  });

  const { data: mediosPago = [], isLoading: loadingMedios } = useMedioPagos();

  const campos = [
    {
      name: "medioPagoId",
      label: "Medio de pago",
      type: "select",
      options: mediosPago.map((m) => ({
        value: m.medioPagoId.toString(),
        label: m.descripcionMedioPago,
      })),
      placeholder: "Selecciona un medio de pago",
    },
    {
      name: "numeroTarjeta",
      label: "Número de tarjeta",
      type: "text",
      placeholder: "Número de tarjeta",
    },
    {
      name: "fechaVencimiento",
      label: "Fecha de vencimiento",
      type: "text",
      placeholder: "MM/AA",
    },
    { name: "cvv", label: "CVV", type: "text", placeholder: "CVV" },
    { name: "estado", label: "Activo", type: "checkbox" },
  ];

  // Inicializar formulario al abrir modal
  useEffect(() => {
    if (modo === "editar" && tarjeta) {
      setForm({
        medioPagoId: tarjeta.medioPagoId?.toString() ?? "",
        numeroTarjeta: tarjeta.numeroTarjeta ?? "",
        fechaVencimiento: tarjeta.fechaVencimiento ?? "",
        cvv: tarjeta.cvv ?? "",
        estado: Boolean(tarjeta.estado),
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
  const bgColor = form.estado
    ? "bg-gray-100 dark:bg-gray-800"
    : "bg-gray-300 dark:bg-gray-700";
  const iconColor = form.estado
    ? "text-gray-800 dark:text-gray-200"
    : "text-gray-500";

  const handleGuardar = async () => {
    try {
      await onSubmit(form);
    } catch (error) {
      console.error(error);
    }
  };

  const renderError = (campo) =>
    errores?.[campo] && (
      <p className="text-red-500 text-xs mt-1">{errores[campo]}</p>
    );

  const inputClass = (campo) =>
    `w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white ${
      errores?.[campo]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 dark:border-gray-700 focus:ring-primary"
    }`;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {modo === "crear" ? "Agregar tarjeta" : "Editar tarjeta"}
        </h2>

        {/* Tarjeta preview */}
        <div
          className={`rounded-2xl p-5 h-36 border shadow-sm transition ${bgColor}`}
        >
          <div className="flex justify-between items-start">
            <div
              className={`p-3 rounded-xl ${bgColor} flex items-center justify-center`}
            >
              {esBilletera ? (
                <Wallet size={22} className={iconColor} />
              ) : (
                <CreditCard size={22} className={iconColor} />
              )}
            </div>
            <span className="text-xs font-medium text-gray-500">
              {mediosPago.find(
                (m) => m.medioPagoId.toString() === form.medioPagoId,
              )?.descripcionMedioPago ?? "Tipo de pago"}
            </span>
          </div>

          <div className="mt-6 space-y-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              {form.numeroTarjeta
                ? `•••• •••• •••• ${form.numeroTarjeta.slice(-4)}`
                : "Número de tarjeta"}
            </p>
            <p
              className={`text-xs font-medium ${
                form.estado
                  ? "text-gray-600 dark:text-gray-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {form.estado ? "Activo" : "Inactivo"} | Vence{" "}
              {form.fechaVencimiento || "MM/AA"}
            </p>
          </div>
        </div>

        {/* Formulario dinámico */}
        <div className="space-y-4">
          {campos.map((campo) => {
            if (campo.type === "select") {
              return (
                <div key={campo.name}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {campo.label}
                  </label>
                  {loadingMedios ? (
                    <p>Cargando medios...</p>
                  ) : (
                    <>
                      <select
                        value={form[campo.name]}
                        onChange={(e) =>
                          setForm({ ...form, [campo.name]: e.target.value })
                        }
                        className={inputClass(campo.name)}
                      >
                        <option value="">{campo.placeholder}</option>
                        {campo.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {renderError(campo.name)}
                    </>
                  )}
                </div>
              );
            }

            if (campo.type === "checkbox") {
              return (
                <label
                  key={campo.name}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form[campo.name]}
                    onChange={(e) =>
                      setForm({ ...form, [campo.name]: e.target.checked })
                    }
                  />
                  {campo.label}
                </label>
              );
            }

            // type=text
            return (
              <div key={campo.name}>
                <input
                  type={campo.type}
                  placeholder={campo.placeholder}
                  value={form[campo.name]}
                  onChange={(e) =>
                    setForm({ ...form, [campo.name]: e.target.value })
                  }
                  className={inputClass(campo.name)}
                />
                {renderError(campo.name)}
              </div>
            );
          })}
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
