import axiosClient from "./axiosClient";

// 🔹 Obtener todos los Orden Detalle
export const getOrdenDetalles = async () => {
  const response = await axiosClient.get("/OrdenDetalle");
  return response.data.resultado;
};

// 🔹 Obtener Orden Detalle por ID
export const getOrdenDetallesById = async (ordenDetallesId) => {
  const response = await axiosClient.get(`/OrdenDetalle/${ordenDetallesId}`);
  return response.data.resultado;
};

// 🔹 Crear Orden Detalle
export const createOrdenDetalles = async (nuevoOrdenDetalles) => {
  const response = await axiosClient.post("/OrdenDetalle", nuevoOrdenDetalles);
  return response.data.resultado;
};

// 🔹 Actualizar Orden Detalle (PUT)
export const updateOrdenDetalles = async (ordenDetalles) => {
  const response = await axiosClient.put(
    `/OrdenDetalle/${ordenDetalles.ordenDetallesId}`
  );
  return response.data.resultado;
};
// 🔹 Eliminar  Orden Detalle
export const deleteOrdenDetalles = async (ordenDetallesId) => {
  const response = await axiosClient.delete(`/OrdenDetalle/${ordenDetallesId}`);
  return response.data;
};
