// api/Carrito.js
import axiosClient from "./axiosClient"; 

// 🔹 Obtener todos los carritos
export const getCarritoCompras = async () => {
  const response = await axiosClient.get("/CarritoCompra");
  return response.data.resultado;
};

// 🔹 Obtener carrito por usuarioId
export const ObtenerTodosLosCarritoCompraUsuarioAsync = async (usuarioId) => {
  const response = await axiosClient.get(`/CarritoCompra/usuario/${usuarioId}`);
  return response.data.resultado; 
};


// 🔹 Obtener carrito por ID
export const getCarritoComprasById = async (carritoCompraId) => {
  const response = await axiosClient.get(`/CarritoCompra/${carritoCompraId}`);
  return response.data.resultado;
};

// 🔹 Crear carrito
export const createCarritoCompras = async (nuevoCarrito) => {
  const response = await axiosClient.post("/CarritoCompra", nuevoCarrito);
  return response.data.resultado;
};

// 🔹 Actualizar carrito (PUT)
export const updateCarritoCompras = async (carrito) => {
  const response = await axiosClient.put(
    `/CarritoCompra/${carrito.carritoId}`,
    carrito
  );
  return response.data.resultado;
};

// 🔹 Eliminar  carrito
export const deleteCarritoCompras = async (carritoId) => {
  const response = await axiosClient.delete(`/CarritoCompra/${carritoId}`);
  return response.data;
};

// 🔹 Vaciar carrito por usuario
export const vaciarCarritoCompras = async (usuarioId) => {
  const response = await axiosClient.delete(`/CarritoCompra/vaciar/${usuarioId}`);
  return response.data.resultado;
};

// 🔹 Subtotal del carrito
export const getTotalCarritoCompras = async (usuarioId) => {
  const response = await axiosClient.get(`/CarritoCompra/total/${usuarioId}`);
  return response.data.resultado;
};

// 🔹 PATCH para actualizar cantidad (formato que tu backend espera)
export const patchCarritoCompras = async (carritoId, operaciones) => {
  const response = await axiosClient.patch(
    `/CarritoCompra/${carritoId}`,
    operaciones, // 👈 ejemplo: [{ operationType: 2, path: "cantidad", value: 3 }]
    {
      headers: {
        "Content-Type": "application/json", // ✅ tu API espera JSON normal
      },
    }
  );
  return response.data.resultado;
};

export const confirmarCompraCarrito = async (usuarioId) => {
  const response = await axiosClient.post(`/CarritoCompra/confirmar/${usuarioId}`);
  return response.data.resultado;
};


