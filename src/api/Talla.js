import axiosClient from "./axiosClient";

// 🔹 Obtener todos los Talla
export const getTallas = async () => {
  const response = await axiosClient.get("/Talla");
  return response.data.resultado;
};

// 🔹 Obtener Talla por ID
export const getTallasById = async (tallaId) => {
  const response = await axiosClient.get(`/Talla/${tallaId}`);
  return response.data.resultado;
};

// 🔹 Crear Talla
export const createTallas = async (nuevoTallas) => {
  const response = await axiosClient.post("/Talla", nuevoTallas);
  return response.data.resultado;
};

// 🔹 Actualizar Talla (PUT)
export const updateTallas = async (talla) => {
  const response = await axiosClient.put(`/Talla/${talla.tallaId}`, talla);
  return response.data.resultado;
};

// 🔹 Eliminar producto del Talla
export const deleteTallas = async (tallaId) => {
  const response = await axiosClient.delete(`/Talla/${tallaId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelTallas = async () => {
  const response = await axiosClient.get("/Talla/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
