import axiosClient from './axiosClient'


// 🔹 Obtener todos los Direccion
export const getDirecciones = async () => {
  const response = await axiosClient.get("/Direccion");
  return response.data.resultado;
}

// 🔹 Obtener Direccion por ID
export const getDireccionesById = async (direccionId) => {
  const response = await axiosClient.get(`/Direccion/${direccionId}`);
  return response.data.resultado;
};

// 🔹 Crear Direccion
export const createDirecciones= async (nuevoDirecciones) => {
  const response = await axiosClient.post("Direccion", nuevoDirecciones);
  return response.data.resultado;
}

// 🔹 Actualizar Direccion (PUT)
export const updateDirecciones = async (direccion) => {
  const response = await axiosClient.put(`/Direccion/${direccion.direccionId}`, direccion);
  return response.data.resultado;
};

// 🔹 Eliminar  Direccion
export const deleteDirecciones = async (direccionId) => {
  const response = await axiosClient.delete(`/Direccion/${direccionId}`);
  return response.data;
}

// 🔹General Excel
export const exportarExcelDirecciones = async () => {  
  const response = await axiosClient.get("/Direccion/exportar-excel", {
    responseType: "blob", 
  });
  return response;
};









