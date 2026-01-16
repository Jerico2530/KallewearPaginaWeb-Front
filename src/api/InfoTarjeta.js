import axiosClient from "./axiosClient";

// 🔹 Obtener todos los InfoTarjeta
export const getInfoTarjetas = async () => {
  const response = await axiosClient.get("/InfoTarjeta");
  return response.data.resultado;
};

// 🔹 Obtener InfoTarjeta por ID
export const getInfoTarjetasById = async (infoTarjetaId) => {
  const response = await axiosClient.get(`/InfoTarjeta/${infoTarjetaId}`);
  return response.data.resultado;
};

// 🔹 Obtener InfoTarjetas por Usuario
export const getInfoTarjetasByUsuario = async (usuarioId) => {
  const response = await axiosClient.get(
    `/InfoTarjeta/usuario/${usuarioId}`
  );
  return response.data.resultado;
};

// 🔹 Crear InfoTarjeta
export const createInfoTarjetas = async (nuevoInfoTarjetas) => {
  const response = await axiosClient.post("/InfoTarjeta", nuevoInfoTarjetas);
  return response.data.resultado;
};

// 🔹 Actualizar InfoTarjeta (PUT)
export const updateInfoTarjetas = async (infoTarjeta) => {
  const response = await axiosClient.put(
    `/InfoTarjeta/${infoTarjeta.infoTarjetaId}`,
    infoTarjeta
  );
  return response.data.resultado;
};

// 🔹 Eliminar InfoTarjeta
export const deleteInfoTarjetas = async (infoTarjetaId) => {
  const response = await axiosClient.delete(`/InfoTarjeta/${infoTarjetaId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelInfoTarjetas = async () => {
  const response = await axiosClient.get("/InfoTarjeta/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
