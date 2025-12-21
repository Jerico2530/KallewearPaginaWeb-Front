import axiosClient from "./axiosClient";

// 🔹 Obtener todos los PermRol
export const getPermRoles = async () => {
  const response = await axiosClient.get("/PermRol");
  return response.data.resultado;
};

// 🔹 Obtener PermRol por ID
export const getPermRolesById = async (permRolId) => {
  const response = await axiosClient.get(`/PermRol/${permRolId}`);
  return response.data.resultado;
};

// 🔹 Crear PermRol
export const createPermRoles = async (nuevoPermRoles) => {
  const response = await axiosClient.post("/PermRol", nuevoPermRoles);
  return response.data.resultado;
};

// 🔹 Actualizar PermRol (PUT)
export const updatePermRoles = async (permRol) => {
  const response = await axiosClient.put(
    `/PermRol/${permRol.permRolId}`,
    permRol
  );
  return response.data.resultado;
};

// 🔹 Eliminar  PermRol
export const deletePermRoles = async (permRolId) => {
  const response = await axiosClient.delete(`/PermRol/${permRolId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelPermRoles = async () => {
  const response = await axiosClient.get("/PermRol/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
