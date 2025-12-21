import axiosClient  from "./axiosClient";

// 🔹 Obtener todos los anuncio
export const getAnuncios = async () => {
  const response = await axiosClient.get("/Anuncio");
  return response.data.resultado;
}

// 🔹 Obtener anuncio por ID
export const getAnunciosById = async (anuncioId) => {
  const response = await axiosClient.get(`/Anuncio/${anuncioId}`);
  return response.data.resultado;
};

// 🔹 Crear anuncio
export const createAnuncios= async (nuevoAnuncios) => {
  const response = await axiosClient.post("/Anuncio", nuevoAnuncios);
  return response.data.resultado;
}

// 🔹 Actualizar anuncio (PUT)
export const updateAnuncios = async (anuncio) => {
  const response = await axiosClient.put(`/Anuncio/${anuncio.anuncioId}`, anuncio);
  return response.data.resultado;
};

// 🔹 Eliminar producto del anuncio
export const deleteAnuncios = async (anuncioId) => {
  const response = await axiosClient.delete(`/Anuncio/${anuncioId}`);
  return response.data;
}

// 🔹General Excel
export const exportarExcelAnuncios = async () => {  
  const response = await axiosClient.get("/Anuncio/exportar-excel", {
    responseType: "blob", 
  });
  return response;
};
