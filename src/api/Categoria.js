import axiosClient from "./axiosClient";

// 🔹 Obtener todos los categoria
export const getCategorias = async () => {
  const response = await axiosClient.get("/Categoria");
  return response.data.resultado;
};

// 🔹 Obtener categoria por ID
export const getCategoriasById = async (categoriaId) => {
  const response = await axiosClient.get(`/Categoria/${categoriaId}`);
  return response.data.resultado;
};

// 🔹 Crear categoria
export const createCategorias = async (nuevoCategorias) => {
  const response = await axiosClient.post("/Categoria", nuevoCategorias);
  return response.data.resultado;
};

// 🔹 Eliminar categoria
export const deleteCategorias = async (categoriaId) => {
  const response = await axiosClient.delete(`/Categoria/${categoriaId}`);
  return response.data;
};

// 🔹 Actualizar categoria (PUT)
export const updateCategorias = async (categoria) => {
  const response = await axiosClient.put(
    `/Categoria/${categoria.categoriaId}`,
    categoria
  );
  return response.data.resultado;
};

// 🔹General Excel
export const exportarExcelCategorias = async () => {
  const response = await axiosClient.get("/Categoria/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
