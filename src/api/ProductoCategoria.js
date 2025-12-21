import axiosClient from "./axiosClient";

// 🔹 Obtener todos los Producto Categoria
export const getProductoCategorias = async () => {
  const response = await axiosClient.get("/ProductoCategoria");
  return response.data.resultado;
};

// 🔹 Obtener Producto Categoria por ID
export const getProductoCategoriasById = async (productoCategoriaId) => {
  const response = await axiosClient.get(
    `/ProductoCategoria/${productoCategoriaId}`
  );
  return response.data.resultado;
};

// 🔹 Crear Producto Categoria
export const createProductoCategorias = async (nuevoProductoCategorias) => {
  const response = await axiosClient.post(
    "/ProductoCategoria",
    nuevoProductoCategorias
  );
  return response.data.resultado;
};

// 🔹 Actualizar Producto Categoria (PUT)
export const updateProductoCategorias = async (productoCategoria) => {
  const response = await axiosClient.put(
    `/ProductoCategoria/${productoCategoria.productoCategoriaId}`,
    productoCategoria
  );
  return response.data.resultado;
};

// 🔹 Eliminar producto del Producto Categoria
export const deleteProductoCategorias = async (productoCategoriaId) => {
  const response = await axiosClient.delete(
    `/ProductoCategoria/${productoCategoriaId}`
  );
  return response.data;
};

// 🔹General Excel
export const exportarExcelProductoCategorias = async () => {
  const response = await axiosClient.get("/ProductoCategoria/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
