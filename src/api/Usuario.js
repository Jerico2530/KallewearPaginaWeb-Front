import axiosClient from "./axiosClient";

// 🔹 Obtener todos los usuario
export const getUsuarios = async () => {
  const response = await axiosClient.get("/Usuario");
  return response.data.resultado;
};

// 🔹 Obtener todos los usuario actual
export const getUsuarioActual = async () => {
  const response = await axiosClient.get(`/Usuario/actual`);
  return response.data.resultado;
};
// 🔹 Obtener usuario por ID

export const getUsuariosById = async (usuarioId) => {
  const response = await axiosClient.get(`/Usuario/${usuarioId}`);
  return response.data.resultado;
};
// 🔹 Crear usuario
export const createUsuarios = async (nuevoUsuario) => {
  const response = await axiosClient.post("/Usuario", nuevoUsuario);
  return response.data.resultado;
};

// 🔹 Actualizar usuario (PUT)

export const updateUsuarios = async (usuario) => {
  const response = await axiosClient.put(
    `/Usuario/${usuario.usuarioId}`,
    usuario
  );
  return response.data.resultado;
};
// 🔹 Eliminar producto del usuario
export const deleteUsuarios = async (usuarioId) => {
  const response = await axiosClient.delete(`/Usuario/${usuarioId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelUsuarios = async () => {
  const response = await axiosClient.get("/Usuario/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
