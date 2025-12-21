import axiosClient from "./axiosClient";

// 🔹 Obtener todos los Orden
export const getOrdenes = async () => {
  const response = await axiosClient.get("/Orden");
  return response.data.resultado;
};

// 🔹 Obtener Orden por ID
export const getOrdenesById = async (ordenId) => {
  const response = await axiosClient.get(`/Orden/${ordenId}`);
  // response.data.resultado es un objeto, no un array
  return response.data;
};

// 🔹 Crear Orden
export const createOrdenes = async (nuevoOrdenes) => {
  const response = await axiosClient.post("/Orden", nuevoOrdenes);
  return response.data.resultado;
};

// 🔹 Actualizar Orden (PUT)
export const updateOrdenes = async (orden) => {
  const response = await axiosClient.put(`/Orden/${orden.ordenId}`, orden);
  return response.data.resultado;
};

// 🔹 Eliminar  Orden
export const deleteOrdenes = async (ordenId) => {
  const response = await axiosClient.delete(`/Orden/${ordenId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelOrdenes = async () => {
  const response = await axiosClient.get("/Orden/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
