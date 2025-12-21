import axiosClient from "./axiosClient";

// 🔹 Obtener todos los Noticias
export const getNoticias = async () => {
  const response = await axiosClient.get("/Noticia");
  return response.data.resultado;
};

// 🔹 Obtener Noticias por ID
export const getNoticiasById = async (noticiaId) => {
  const response = await axiosClient.get(`/Noticia/${noticiaId}`);
  return response.data.resultado;
};

// 🔹 Crear Noticias
export const createNoticias = async (nuevoNoticias) => {
  const response = await axiosClient.post("/Noticia", nuevoNoticias);
  return response.data.resultado;
};

// 🔹 Actualizar Noticias (PUT)

export const updateNoticias = async (noticia) => {
  const response = await axiosClient.put(
    `/Noticia/${noticia.noticiaId}`,
    noticia
  );
  return response.data.resultado;
};

// 🔹 Eliminar  Noticias
export const deleteNoticias = async (noticiaId) => {
  const response = await axiosClient.delete(`/Noticia/${noticiaId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelNoticias = async () => {
  const response = await axiosClient.get("/Noticia/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
