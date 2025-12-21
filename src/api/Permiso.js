import axiosClient from './axiosClient'

// 🔹 Obtener todos los Permiso
export const getPermisos = async () => {
  const response = await axiosClient.get("/Permiso");
  return response.data.resultado;
}
// 🔹 Obtener Permiso por ID
export const getPermisosById = async (permisoId) => {
  const response = await axiosClient.get(`/Permiso/${permisoId}`);
  return response.data.resultado;
};


// 🔹 Crear Permiso
export const createPermisos = async (nuevoPermisos) => {
  const response = await axiosClient.post("/Permiso", nuevoPermisos);
  return response.data.resultado;
}

// 🔹 Actualizar Permiso (PUT)
export const updatePermisos = async (permiso) => {
  const response = await axiosClient.put(`/Permiso/${permiso.permisoId}`, permiso);
  return response.data.resultado;
};

// 🔹 Eliminar  Permiso
export const deletePermisos = async (permisoId) => {
  const response = await axiosClient.delete(`/Permiso/${permisoId}`);
  return response.data;
};

// 🔹General Excel
export const exportarExcelPermisos = async () => {  
  const response = await axiosClient.get("/Permiso/exportar-excel", {
    responseType: "blob", 
  });
  return response;
};










