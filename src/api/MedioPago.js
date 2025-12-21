import axiosClient from './axiosClient';

// 🔹 Obtener todos los Medio Pago
export const getMedioPagos = async () => {
  const response = await axiosClient.get("/MedioPago");
  return response.data.resultado;
};

// 🔹 Obtener Medio Pago por ID
export const getMedioPagosById = async (medioPagoId) => {
  const response = await axiosClient.get(`/MedioPago/${medioPagoId}`);
  return response.data.resultado;
};

// 🔹 Crear Medio Pago
export const createMedioPagos = async (nuevoMedioPagos) => {
  const response = await axiosClient.post("/MedioPago", nuevoMedioPagos);
  return response.data.resultado;
};

// 🔹 Actualizar Medio Pago (PUT)
export const updateMedioPagos = async (medioPago) => {
  const response = await axiosClient.put(`/MedioPago/${medioPago.medioPagoId}`, medioPago);
  return response.data.resultado;
};

// 🔹 Eliminar  Medio Pago
export const deleteMedioPagos = async (medioPagoId) => {
  const response = await axiosClient.delete(`/MedioPago/${medioPagoId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelMedioPagos = async () => {  
  const response = await axiosClient.get("/MedioPago/exportar-excel", {
    responseType: "blob", 
  });
  return response;
};









