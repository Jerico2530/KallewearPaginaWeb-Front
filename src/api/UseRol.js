import axiosClient from "./axiosClient";

// 🔹 Obtener todos los userRol
export const getUserRoles = async () => {
  const response = await axiosClient.get("/UserRol");
  return response.data.resultado;
};

// 🔹 Obtener userRol por ID
export const getUserRolesById = async (userRolId) => {
  const response = await axiosClient.get(`/UserRol/${userRolId}`);
  return response.data.resultado;
};

// 🔹 Crear userRol
export const createUserRoles = async (nuevoUserRoles) => {
  const response = await axiosClient.post("/UserRol", nuevoUserRoles);
  return response.data.resultado;
};

// 🔹 Actualizar userRol (PUT)
export const updateUserRoles = async (userRol) => {
  const response = await axiosClient.put(
    `/UserRol/${userRol.userRolId}`,
    userRol
  );
  return response.data.resultado;
};

// 🔹 Eliminar producto del userRol
export const deleteUserRoles = async (userRolId) => {
  const response = await axiosClient.delete(`/UserRol/${userRolId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelUserRoles = async () => {
  const response = await axiosClient.get("/UserRol/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
