// src/api/Pago.js
import axiosClient from "./axiosClient";

// 🔹 Obtener todos los Pago
export const getPagos = async () => {
  const response = await axiosClient.get("/Pago");
  return response.data.resultado;
};

export const getPagosUsuario = async (usuarioId) => {
  const response = await axiosClient.get(`/Pago/usuario/${usuarioId}`);
  return response.data.resultado;
};

// 🔹 Obtener Pago por ID
export const getPagosById = async (pagoId) => {
  const response = await axiosClient.get(`/Pago/${pagoId}`);
  return response.data.resultado;
};

// 🔹 Crear Pago
export const createPagos = async (nuevoPago) => {
  const response = await axiosClient.post("/Pago", nuevoPago);
  return response.data.resultado;
};

// 🔹 Actualizar Pago (PUT)
export const updatePagos = async (pago) => {
  const response = await axiosClient.put(`/Pago/${pago.pagoId}`, pago);
  return response.data.resultado;
};

// 🔹 Eliminar Pago
export const deletePagos = async (pagoId) => {
  const response = await axiosClient.delete(`/Pago/${pagoId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelPagos = async () => {
  const response = await axiosClient.get("/Pago/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
