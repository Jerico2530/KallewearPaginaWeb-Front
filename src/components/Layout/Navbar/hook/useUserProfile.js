/**
 * useUserProfile.js
 * -------------------------------------------------
 * Custom Hook para manejar la información y acciones del perfil de usuario.
 *
 * Funcionalidades:
 * 1️⃣ Controla el estado del dropdown del perfil (abrir/cerrar).
 * 2️⃣ Accede a los datos del usuario actual y permisos desde el store global.
 * 3️⃣ Maneja la lógica de logout, limpiando la caché de React Query y
 *    reiniciando la sesión de invitado (guest).
 * 4️⃣ Genera el nombre completo del usuario para mostrar en la UI.
 *
 */

import { useRef, useState } from "react";
import useUserStore from "../../../../store/userStore";
import { useAuthBootstrap } from "../../../../hooks/useAuthBootstrap";
import { useUsuarioActual } from "../../../../hooks/useUsuarioActual";
import { queryClient } from "../../../../api/queryClient";

export const useUserProfile = (navigate) => {
  // Referencia para detectar clics fuera del dropdown de perfil
  const profileRef = useRef();
  // Estado para controlar si el dropdown del perfil está abierto
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
// Acceso a funciones y permisos del usuario desde el store global
  const { logout, isGuest } = useUserStore();
  const userPermisos = useUserStore((state) => state.permisos || []);
   // Hook para inicializar la sesión de invitado si es necesario
  const { loadGuest } = useAuthBootstrap();
  // Hook para obtener los datos actuales del usuario
  const { data: userInfo, isLoading } = useUsuarioActual();
// Composición del nombre completo del usuario para la UI
  const displayNombre = `${userInfo?.nombreCompleto || ""} ${
    userInfo?.apellidoCompleto || ""
  }`;
 // Función para cerrar sesión de manera segura y limpiar datos
  const handleLogout = async () => {
    logout();// Limpiar estado de usuario
    queryClient.removeQueries(["usuarioActual"]);// Limpiar cache de React Query
    await loadGuest();// Inicializar sesión de invitado
    setProfileDropdownOpen(false);// Cerrar dropdown
    navigate("/");// Redirigir al home
  };

  return {
    profileRef,
    profileDropdownOpen,
    setProfileDropdownOpen,
    isGuest,
    userPermisos,
    userInfo,
    isLoading,
    displayNombre,
    handleLogout,
  };
};
