import axiosClient from "./axiosClient";

// 🔹 Obtener todos los Sucursal
export const getSucursales = async () => {
  const response = await axiosClient.get("/Sucursal");
  return response.data.resultado;
};

// 🔹 Obtener Sucursal por ID
export const getSucursalesById = async (sucursalId) => {
  const response = await axiosClient.get(`/Sucursal/${sucursalId}`);
  return response.data.resultado;
};

// 🔹 Crear Sucursal
export const createSucursales = async (nuevoSucursales) => {
  const response = await axiosClient.post("/Sucursal", nuevoSucursales);
  console.log("delete response:", response.data);
  return response.data.resultado;
};

// 🔹 Actualizar Sucursal (PUT)
export const updateSucursales = async (sucursal) => {
  const response = await axiosClient.put(
    `/Sucursal/${sucursal.sucursalId}`,
    sucursal
  );
  return response.data.resultado;
};

// 🔹 Eliminar producto del Sucursal
export const deleteSucursales = async (sucursalId) => {
  const response = await axiosClient.delete(`/Sucursal/${sucursalId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelSucursales = async () => {
  const response = await axiosClient.get("/Sucursal/exportar-excel", {
    responseType: "blob",
  });
  return response;
};
