import axiosClient from './axiosClient'

// 🔹 Obtener todos los Descuento
export const getDescuentos = async () => {
  const response = await axiosClient.get("Descuento");
  return response.data.resultado;
};

// 🔹 Obtener todos los Descuento activo
export const getDescuentosActivos = async () => {
  const response = await axiosClient.get(`/Descuento/activos`);
  return response.data.resultado;
};

// 🔹 Obtener Descuento por ID
export const getDescuentosById = async (descuentoId) => {
  const response = await axiosClient.get(`/Descuento/${descuentoId}`);
  return response.data.resultado;
};

// 🔹 Crear Descuento
export const createDescuentos= async (nuevoDescuentos) => {
  const response = await axiosClient.post("/Descuento", nuevoDescuentos);
  return response.data.resultado;
}

// 🔹 Actualizar Descuento (PUT)
export const updateDescuentos = async (descuento) => {
  const response = await axiosClient.put(`/Descuento/${descuento.descuentoId}`, descuento);
  return response.data.resultado;
};

// 🔹 Eliminar  Descuento
export const deleteDescuentos = async (descuentoId) => {
  const response = await axiosClient.delete(`/Descuento/${descuentoId}`);;
  return response.data;
}












