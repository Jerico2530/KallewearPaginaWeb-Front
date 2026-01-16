// src/api/DetalleTarjeta.js
import axiosClient from "./axiosClient";

// 🔹 Obtener todos los DetalleTarjeta
export const getDetalleTarjetas = async () => {
  const response = await axiosClient.get("/DetalleTarjeta");
  return response.data.resultado;
};

// 🔹 Obtener DetalleTarjeta por ID
export const getDetalleTarjetasById = async (detalleTarjetaId) => {
  const response = await axiosClient.get(`/DetalleTarjeta/${detalleTarjetaId}`);
  return response.data.resultado;
};

// 🔹 Crear DetalleTarjeta
export const createDetalleTarjetas = async (nuevoDetalleTarjeta) => {
  const response = await axiosClient.post("/DetalleTarjeta", nuevoDetalleTarjeta);
  return response.data.resultado;
};

// 🔹 Actualizar DetalleTarjeta (PUT)
export const updateDetalleTarjetas = async (detalleTarjeta) => {
  const response = await axiosClient.put(`/DetalleTarjeta/${detalleTarjeta.detalleTarjetaId}`, detalleTarjeta);
  return response.data.resultado;
};

// 🔹 Eliminar DetalleTarjeta
export const deleteDetalleTarjetas = async (detalleTarjetaId) => {
  const response = await axiosClient.delete(`/DetalleTarjeta/${detalleTarjetaId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelDetalleTarjetas = async () => {
  const response = await axiosClient.get("/DetalleTarjeta/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
