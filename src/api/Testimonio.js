import axiosClient from "./axiosClient";

// 🔹 Obtener todos los Testimonio
export const getTestimonios = async () => {
  const response = await axiosClient.get("/Testimonio");
  return response.data.resultado;
};

// 🔹 Obtener Testimonio por ID
export const getTestimoniosById = async (testimonioId) => {
  const response = await axiosClient.get(`/Testimonio/${testimonioId}`);
  return response.data.resultado;
};

// 🔹 Crear Testimonio
export const createTestimonios = async (nuevoTestimonios) => {
  const response = await axiosClient.post("/Testimonio", nuevoTestimonios);
  return response.data.resultado;
};

// 🔹 Actualizar Testimonio (PUT)
export const updateTestimonios = async (testimonio) => {
  const response = await axiosClient.put(
    `/Testimonio/${testimonio.testimonioId}`,
    testimonio
  );
  return response.data.resultado;
};

// 🔹 Eliminar producto del Testimonio
export const deleteTestimonios = async (testimonioId) => {
  const response = await axiosClient.delete(`/Testimonio/${testimonioId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelTestimonios = async () => {
  const response = await axiosClient.get("/Testimonio/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
