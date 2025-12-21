import axiosClient from "./axiosClient";

// 🔹 Obtener todos los Rol
export const getRoles = async () => {
  const response = await axiosClient.get("/Rol");
  return response.data.resultado;
};

// 🔹 Obtener Rol por ID
export const getRolesById = async (rolId) => {
  const response = await axiosClient.get(`/Rol/${rolId}`);
  return response.data.resultado;
};

// 🔹 Crear Rol
export const createRoles = async (nuevoRoles) => {
  const response = await axiosClient.post("/Rol", nuevoRoles);
  return response.data.resultado;
};

// 🔹 Actualizar Rol (PUT)
export const updateRoles = async (rol) => {
  const response = await axiosClient.put(`/Rol/${rol.rolId}`, rol);
  return response.data.resultado;
};

// 🔹 Eliminar producto del Rol
export const deleteRoles = async (rolId) => {
  const response = await axiosClient.delete(`/Rol/${rolId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelRoles = async () => {
  const response = await axiosClient.get("/Rol/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
