/**
 * Página de Perfil de Usuario
 * ------------------------------------------------------------------
 * Propósito del componente:
 *   - Mostrar la información detallada del usuario actualmente autenticado.
 *   - Presentar foto de perfil, datos personales y roles de manera clara y organizada.
 *
 * Funcionalidades clave:
 *   - Obtención de datos del usuario y sus roles mediante hooks personalizados.
 *   - Formateo y separación de nombres, apellidos y roles para una visualización más legible.
 *   - Vista responsiva y compatible con modo oscuro.
 *   - Componente de presentación modular para cada elemento de información.
 */
import React, { useEffect, useState, useMemo } from "react";
import { FaUser, FaEnvelope, FaIdCard, FaUserTag } from "react-icons/fa";

import PageCrud from "../Pagess/PageCrud";
import { useUserRoles } from "../../../hooks/useUserRole";
import { useUsuarioActual } from "../../../hooks/useUsuarioActual";

/**
 * Helper para formatear la información del perfil
 * - Separa nombres y apellidos en primer/segundo nombre y apellido paterno/materno.
 * - Combina los roles del usuario en una cadena legible.
 */
const formatearPerfil = (userInfo, userRoles) => {
  if (!userInfo) return null;
  const nombres = userInfo.nombreCompleto?.split(" ") ?? [];
  const apellidos = userInfo.apellidoCompleto?.split(" ") ?? [];
  const rolesUsuario =
    userRoles
      ?.filter((r) => r.usuarioId === userInfo.usuarioId)
      .map((r) => r.nombreRol) ?? [];
  return {
    ...userInfo,
    primerNombre: nombres[0] || "",
    segundoNombre: nombres.slice(1).join(" ") || "",
    apellidoPaterno: apellidos[0] || "",
    apellidoMaterno: apellidos.slice(1).join(" ") || "",
    rolUsuario: rolesUsuario.join(", ") || "Invitado",
  };
};

const PerfilPage = () => {
  // Obtención de datos del usuario actual
  const { data: userInfo, isLoading } = useUsuarioActual();
  const { data: userRoles } = useUserRoles();
  // Estado local para la previsualización de la imagen de perfil
  const [imagePreview, setImagePreview] = useState(null);
  // Memoización para no recalcular perfil a menos que cambien los datos
  const perfil = useMemo(
    () => formatearPerfil(userInfo, userRoles),
    [userInfo, userRoles]
  );
  // Actualiza la previsualización cuando cambia la información del perfil
  useEffect(() => {
    if (perfil?.imagen) setImagePreview(perfil.imagen);
  }, [perfil]);
  // Render de carga mientras se obtienen los datos
  if (isLoading || !perfil) {
    return (
      <PageCrud activeTab="perfil">
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
          <p className="text-lg text-gray-500">Cargando información...</p>
        </div>
      </PageCrud>
    );
  }

  return (
    <PageCrud activeTab="perfil">
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)] p-6">
        <div
          className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800
                        text-gray-900 dark:text-white shadow-xl rounded-3xl w-full max-w-4xl p-10 
                        border border-gray-200 dark:border-gray-700"
        >
          {/* Título principal de la página */}
          <h1 className="text-4xl font-extrabold text-center mb-8 tracking-tight text-gray-800 dark:text-gray-100">
            Perfil de Usuario
          </h1>

          {/* Foto de perfil con previsualización */}
          <div className="flex justify-center mb-8">
            <div className="relative w-44 h-44 rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700">
              <img
                src={imagePreview || "https://via.placeholder.com/150"}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </div>

          {/* Información detallada del usuario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <InfoItem
              icon={<FaUser />}
              label="Primer Nombre"
              value={perfil.primerNombre}
            />
            <InfoItem
              icon={<FaUser />}
              label="Segundo Nombre"
              value={perfil.segundoNombre}
            />
            <InfoItem
              icon={<FaUser />}
              label="Apellido Paterno"
              value={perfil.apellidoPaterno}
            />
            <InfoItem
              icon={<FaUser />}
              label="Apellido Materno"
              value={perfil.apellidoMaterno}
            />
            <InfoItem icon={<FaIdCard />} label="DNI" value={perfil.dni} />
            <InfoItem
              icon={<FaUserTag />}
              label="Rol"
              value={perfil.rolUsuario}
            />
            <InfoItem
              icon={<FaEnvelope />}
              label="Correo Electrónico"
              value={perfil.correoElectronico}
            />
          </div>
        </div>
      </div>
    </PageCrud>
  );
};
/**
 * Componente de presentación de cada elemento de información
 * - label: nombre del campo
 * - value: valor correspondiente
 */
const InfoItem = ({ icon, label, value }) => (
  <div className="flex flex-col bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center gap-3 mb-1 text-gray-600 dark:text-gray-300">
      {icon} <span className="font-medium">{label}</span>
    </div>
    <span className="text-gray-800 dark:text-gray-100 font-semibold text-lg">
      {value}
    </span>
  </div>
);

export default PerfilPage;
