import axiosClient from "./axiosClient";

// 🔹 Obtener todos los Historia
export const getHistorias = async () => {
  const response = await axiosClient.get("/Historia");
  return response.data.resultado;
};

// 🔹 Obtener Historia por ID
export const getHistoriasById = async (historiaId) => {
  const response = await axiosClient.get(`/Historia/${historiaId}`);
  return response.data.resultado;
};

// 🔹 Crear Historia
export const createHistorias = async (nuevoHistorias) => {
  const response = await axiosClient.post("/Historia", nuevoHistorias);
  return response.data.resultado;
};

// 🔹 Actualizar Historia (PUT)
export const updateHistorias = async (historia) => {
  const response = await axiosClient.put(
    `/Historia/${historia.historiaId}`,
    historia
  );
  return response.data.resultado;
};

// 🔹 Eliminar Historia
export const deleteHistorias = async (historiaId) => {
  const response = await axiosClient.delete(`/Historia/${historiaId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelHistorias = async () => {
  const response = await axiosClient.get("/Historia/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
