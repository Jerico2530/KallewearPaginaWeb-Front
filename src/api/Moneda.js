// src/api/Moneda.js
import axiosClient from "./axiosClient";

// 🔹 Obtener todos los Moneda
export const getMonedas = async () => {
  const response = await axiosClient.get("/Moneda");
  return response.data.resultado;
};

// 🔹 Obtener Moneda por ID
export const getMonedasById = async (monedaId) => {
  const response = await axiosClient.get(`/Moneda/${monedaId}`);
  return response.data.resultado;
};

// 🔹 Crear Moneda
export const createMonedas = async (nuevoMoneda) => {
  const response = await axiosClient.post("/Moneda", nuevoMoneda);
  return response.data.resultado;
};

// 🔹 Actualizar Moneda (PUT)
export const updateMonedas = async (moneda) => {
  const response = await axiosClient.put(`/Moneda/${moneda.monedaId}`, moneda);
  return response.data.resultado;
};

// 🔹 Eliminar  Moneda
export const deleteMonedas = async (monedaId) => {
  const response = await axiosClient.delete(`/Moneda/${monedaId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelMonedas = async () => {
  const response = await axiosClient.get("/Moneda/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
