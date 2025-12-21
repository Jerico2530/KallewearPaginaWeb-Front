import axiosClient from "./axiosClient";

// 🔹 Obtener todos los producto
export const getProductos = async () => {
  const response= await axiosClient.get("/Producto");
  return response.data.resultado;
};

// 🔹 Crear producto
export const createProducto = async (nuevoProducto) => {
  const response = await axiosClient.post("/Producto", nuevoProducto);
  return response.data.resultado;
};

// 🔹 Actualizar producto (PUT)
export const updateProducto = async (producto) => {
  const response = await axiosClient.put(`/Producto/${producto.productoId}`,producto);
  return response.data.resultado;
};

// 🔹 Eliminar del producto
export const deleteProducto = async (productoId) => {
  const response = await axiosClient.delete(`/Producto/${productoId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelProducto = async () => {  
  const response = await axiosClient.get("/Producto/exportar-excel", {
    responseType: "blob", 
  });
  return response;
};







