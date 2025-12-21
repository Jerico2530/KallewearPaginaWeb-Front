import axiosClient from './axiosClient'

const API_URL = 'http://localhost:5110/api/ProductoFavorito'

export const getProductoFavoritos = async () => {
  const response = await axiosClient.get(API_URL)
  return response.data.resultado;
}

export const createProductoFavoritos= async (nuevoProductoFavoritos) => {
  const response = await axiosClient.post(API_URL, nuevoProductoFavoritos)
  return response.data.resultado; 
}

export const deleteProductoFavoritos = async (codigo) => {
  const response = await axiosClient.delete(`${API_URL}/${codigo}`);
  return response.data;
}

export const getProductoFavoritosById = async (codigo) => {
  const response = await axiosClient.get(`${API_URL}/${codigo}`);
  return response.data.resultado;
};

export const updateProductoFavoritos = async (productoFavorito) => {
  const response = await axiosClient.put(`${API_URL}/${productoFavorito.codigo}`, productoFavorito);
  return response.data.resultado;
};