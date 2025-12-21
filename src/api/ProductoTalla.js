import axiosClient from './axiosClient'

// 🔹 Obtener todos los Producto Talla
export const getProductoTallas = async () => {
  const response = await axiosClient.get("/ProductoTalla");
  return response.data.resultado;
}

// 🔹 Obtener Producto Talla por ID
export const getProductoTallasById = async (productoTallaId) => {
  const response = await axiosClient.get(`/ProductoTalla/${productoTallaId}`);
  return response.data.resultado;
};

// 🔹 Crear Producto Talla
export const createProductoTallas= async (nuevoProductoTallas) => {
  const response = await axiosClient.post("/ProductoTalla", nuevoProductoTallas);
  return response.data.resultado ;
}

// 🔹 Actualizar Producto Talla (PUT)
export const updateProductoTallas = async (productoTalla) => {
  const response = await axiosClient.put(`/ProductoTalla/${productoTalla.productoTallaId}`, productoTalla );
  return response.data.resultado;
};

// 🔹 Eliminar producto del Producto Talla
export const deleteProductoTallas = async (productoTallaId) => {
  const response = await axiosClient.delete(`/ProductoTalla/${productoTallaId}`);
  return response.data;
}

// 🔹General Excel
export const exportarExcelProductoTallas = async () => {  
  const response = await axiosClient.get("/ProductoTalla/exportar-excel", {
    responseType: "blob", 
  });
  return response;
};









