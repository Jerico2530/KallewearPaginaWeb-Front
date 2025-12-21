import axiosClient from "./axiosClient";

// 🔹 Obtener todos los Tipo Pago
export const getTipoPagos = async () => {
  const response = await axiosClient.get("/TipoPago");
  return response.data.resultado;
};

// 🔹 Obtener Tipo Pago por ID
export const getTipoPagosById = async (tipoPagoId) => {
  const response = await axiosClient.get(`/TipoPago/${tipoPagoId}`);
  return response.data.resultado;
};

// 🔹 Crear Tipo Pago
export const createTipoPagos = async (nuevoTipoPagos) => {
  const response = await axiosClient.post("/TipoPago", nuevoTipoPagos);
  return response.data.resultado;
};

// 🔹 Actualizar Tipo Pago (PUT)
export const updateTipoPagos = async (tipoPago) => {
  const response = await axiosClient.put(
    `/TipoPago/${tipoPago.tipoPagoId}`,
    tipoPago
  );
  return response.data.resultado;
};

// 🔹 Eliminar producto del Tipo Pago
export const deleteTipoPagos = async (tipoPagoId) => {
  const response = await axiosClient.delete(`/TipoPago/${tipoPagoId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelTipoPagos = async () => {
  const response = await axiosClient.get("/TipoPago/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
