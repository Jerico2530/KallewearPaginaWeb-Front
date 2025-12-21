import axiosClient from './axiosClient'

// 🔹 Obtener todos los General
export const getGeneros = async () => {
  const response = await axiosClient.get("/Genero");
  return response.data.resultado;
}

// 🔹 Obtener General por ID
export const getGenerosById = async (generoId) => {
  const response = await axiosClient.get(`/Genero/${generoId}`);
  return response.data.resultado;
};

// 🔹 Crear General
export const createGeneros= async (nuevoGeneros) => {
  const response = await axiosClient.post("Genero", nuevoGeneros);
  return response.data.resultado;
}

// 🔹 Actualizar General (PUT)
export const updateGeneros = async (genero) => {
  const response = await axiosClient.put(`/Genero/${genero.generoId}`, genero);
  return response.data.resultado;
};

// 🔹 Eliminar  General
export const deleteGeneros = async (generoId) => {
  const response = await axiosClient.delete(`/Genero/${generoId}`);
  return response.data;
}

// 🔹General Excel
export const exportarExcelGeneros = async () => {  
  const response = await axiosClient.get("/Genero/exportar-excel", {
    responseType: "blob", 
  });
  return response;
};









