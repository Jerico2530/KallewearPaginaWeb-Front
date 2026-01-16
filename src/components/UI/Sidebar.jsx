// components/Sidebar.jsx
import React, { useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Camera,
  ChevronRight,
  User,
  ShoppingBag,
  MapPin,
  CreditCard,
  LogOut,
} from "lucide-react";

import verPerfilLinks from "../../config/verPerfilLinks";
import { useUserProfile } from "../../components/Layout/Navbar/hook/useUserProfile";

const Sidebar = ({ user, navbarHeight = 112 }) => {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  // ✅ Reutiliza la MISMA lógica de logout del Navbar
  const { handleLogout } = useUserProfile(navigate);

  /**
   * Mapeo de iconos desacoplado
   * ✔ fácil de extender
   * ✔ no ensucia el JSX
   */
  const iconMap = useMemo(
    () => ({
      "Mi Perfil": <User size={18} />,
      "Mis Pedidos": <ShoppingBag size={18} />,
      "Direccion": <MapPin size={18} />,
      "Pagos": <CreditCard size={18} />,
    }),
    []
  );

  return (
    <aside
      className="
        w-80
        bg-white
        rounded-3xl
        shadow-md
        overflow-hidden
        sticky
      "
      style={{
        top: navbarHeight + 24, // ✅ respeta navbar + aire visual
        height: "fit-content",
      }}
    >
      {/* ================= HEADER ================= */}
      <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                !imgError && user?.imagen
                  ? user.imagen
                  : "/default-avatar.png"
              }
              alt="avatar"
              onError={() => setImgError(true)}
              className="
                w-16 h-16 rounded-full object-cover
                ring-2 ring-white shadow-md
                transition-transform hover:scale-105
              "
            />

            <button
              type="button"
              className="
                absolute -bottom-1 -right-1
                bg-white text-black p-1.5
                rounded-full shadow
                hover:scale-110 transition
              "
            >
              <Camera size={14} />
            </button>
          </div>

          <div>
            <p className="font-semibold text-lg leading-tight">
              {user?.nombreCompleto} {user?.apellidoCompleto}
            </p>
            <p className="text-xs text-gray-300">
              Usuario registrado 🔥
            </p>
          </div>
        </div>
      </div>

      {/* ================= MENU ================= */}
      <nav className="py-3">
        {verPerfilLinks.map((link) => (
          <NavLink
            key={link.id}
            to={link.link}
            className={({ isActive }) =>
              `
              w-full flex items-center justify-between
              px-6 py-3 text-sm transition-all group
              ${
                isActive
                  ? "bg-gray-100 font-semibold text-black"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              }
            `
            }
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-500">
                {iconMap[link.name]}
              </span>
              {link.name}
            </div>

            <ChevronRight
              size={16}
              className="
                text-gray-400
                transition-transform
                group-hover:translate-x-1
              "
            />
          </NavLink>
        ))}

        {/* ================= LOGOUT ================= */}
        <button
          type="button"
          onClick={handleLogout} // ✅ AHORA CIERRA SESIÓN REAL
          className="
            w-full flex items-center justify-between
            px-6 py-3 text-sm
            text-red-500 hover:bg-red-50
            rounded-md mt-2 transition
          "
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} />
            Cerrar sesión
          </div>

          <ChevronRight size={16} className="text-red-400" />
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
