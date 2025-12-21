import axiosClient from "./axiosClient";

// 🔹 Obtener todos los Pregunta
export const getPreguntas = async () => {
  const response = await axiosClient.get("/Pregunta");
  return response.data.resultado;
};

// 🔹 Obtener Pregunta por ID
export const getPreguntasById = async (preguntaId) => {
  const response = await axiosClient.get(`/Pregunta/${preguntaId}`);
  return response.data.resultado;
};

// 🔹 Crear Pregunta
export const createPreguntas = async (nuevoPreguntas) => {
  const response = await axiosClient.post("/Pregunta", nuevoPreguntas);
  return response.data.resultado;
};

// 🔹 Actualizar Pregunta (PUT)
export const updatePreguntas = async (pregunta) => {
  const response = await axiosClient.put(
    `/Pregunta/${pregunta.preguntaId}`,
    pregunta
  );
  return response.data.resultado;
};

// 🔹 Eliminar  Pregunta
export const deletePreguntas = async (preguntaId) => {
  const response = await axiosClient.delete(`/Pregunta/${preguntaId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelPreguntas = async () => {
  const response = await axiosClient.get("/Pregunta/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
