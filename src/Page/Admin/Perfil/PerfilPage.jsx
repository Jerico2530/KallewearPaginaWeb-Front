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
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaUserTag,
  FaShieldAlt,
} from "react-icons/fa";

import PageCrud from "../Pagess/PageCrud";
import { useUserRoles } from "../../../hooks/useUserRole";
import { useUsuarioActual } from "../../../hooks/useUsuarioActual";
import InfoItem from "./InfoItem";
import LayoutContainer from "../../../utils/LayoutContainer";

/* =======================
   Helper de formateo
======================= */
const formatearPerfil = (userInfo, userRoles) => {
  if (!userInfo) return null;

  const rolesUsuario =
    userRoles
      ?.filter((r) => r.usuarioId === userInfo.usuarioId)
      .map((r) => r.nombreRol) ?? [];

  return {
    ...userInfo,
    nombreCompleto: userInfo.nombreCompleto || "",
    apellidosCompletos: userInfo.apellidoCompleto || "",
    rolUsuario: rolesUsuario.join(", ") || "Invitado",
  };
};

const PerfilPage = () => {
  const { data: userInfo, isLoading } = useUsuarioActual();
  const { data: userRoles } = useUserRoles();

  const [imagePreview, setImagePreview] = useState(null);

  const perfil = useMemo(
    () => formatearPerfil(userInfo, userRoles),
    [userInfo, userRoles]
  );

  useEffect(() => {
    if (perfil?.imagen) setImagePreview(perfil.imagen);
  }, [perfil]);

  if (isLoading || !perfil) {
    return (
      <PageCrud activeTab="perfil">
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cargando información del perfil...
          </p>
        </div>
      </PageCrud>
    );
  }

  return (
    <PageCrud activeTab="perfil">
      <LayoutContainer maxWidth="1100px">
        {/* ================= CARD PRINCIPAL ================= */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* ================= HEADER ================= */}
          <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-700">
            <h1 className="text-xl font-semibold text-white">
              Perfil de Usuario
            </h1>
            <p className="text-sm text-blue-100 mt-1">
              Información personal y roles asignados
            </p>
          </div>

          {/* ================= CONTENIDO ================= */}
          <div className="p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-md">
                  <img
                    src={imagePreview || "https://via.placeholder.com/150"}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Badge */}
                <div className="absolute bottom-1 right-1 bg-green-500 text-white p-2 rounded-full shadow">
                  <FaShieldAlt size={12} />
                </div>
              </div>

              <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {perfil.nombreCompleto} {perfil.apellidosCompletos}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {perfil.rolUsuario}
              </p>
            </div>

            {/* ================= DATOS ================= */}
            {/* ================= DATOS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoItem
                icon={<FaUser />}
                label="Nombre Completo"
                value={perfil.nombreCompleto}
              />

              <InfoItem
                icon={<FaUser />}
                label="Apellidos"
                value={perfil.apellidosCompletos}
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
                full
              />
            </div>
          </div>
        </div>
      </LayoutContainer>
    </PageCrud>
  );
};

export default PerfilPage;
