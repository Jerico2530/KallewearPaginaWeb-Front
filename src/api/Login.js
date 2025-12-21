// src/api/Login.js
import axiosClient from "./axiosClient";

// 🔹 Login normal (con credenciales)
export const createLogin = async (nuevoLogin) => {
  const response = await axiosClient.post(`/Login/Login`, nuevoLogin);
  return response.data.resultado;
};

// 🔹 Login invitado (sin credenciales)
export const loginInvitado = async () => {
  const response = await axiosClient.post(`/Login/login-invitado`);
  return response.data.resultado;
};


