/**
 * Navbar.jsx
 * -------------------------------------------------
 * Componente de navegación principal de la aplicación.
 *
 * Funcionalidades clave:
 * 1️⃣ Barra fija y responsive que se oculta al hacer scroll hacia abajo y se muestra al subir.
 * 2️⃣ Integración con el estado global del usuario para mostrar:
 *    - Login si es invitado.
 *    - Perfil con dropdown y opciones (Ver perfil, Ver carrito, Logout) si está autenticado.
 * 3️⃣ Renderizado condicional de enlaces según los permisos del usuario.
 * 4️⃣ Dropdown dinámico para secciones con submenús y enlaces adicionales.
 * 5️⃣ Integración con DarkMode y carrito interactivo (MyCart).
 *
 * Propósito:
 * - Centralizar la navegación y accesibilidad a secciones clave del proyecto.
 * - Facilitar la interacción del usuario y reflejar permisos empresariales.
 * - Mantener la UI limpia, profesional y adaptable a dispositivos móviles.
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import Logo from "../../../assets/logo.png";
import DarkMode from "./DarkMode";
import MyCart from "../../../Page/Public/Cart/MyCart";
import MenuConfig from "../../../config/menuConfig";
import DropdownLinks from "../../../config/dropdownLinks";

import { hasPermiso } from "../../../utils/permissionUtils";

import { useNavbarScroll } from "../Navbar/hook/useNavbarScroll";
import { useOutsideClick } from "../Navbar/hook/useOutsideClick";
import { useUserProfile } from "../Navbar/hook/useUserProfile";

const Navbar = ({ handleLoginPopup }) => {
  const navigate = useNavigate();

  // --- lógica separada ---
  const { showNavbar } = useNavbarScroll();
  const {
    profileRef,
    profileDropdownOpen,
    setProfileDropdownOpen,
    isGuest,
    userPermisos,
    userInfo,
    isLoading,
    displayNombre,
    handleLogout,
  } = useUserProfile(navigate);

  useOutsideClick(profileRef, () => setProfileDropdownOpen(false));

  return (
    <div
      id="main-navbar"
      className={`shadow-md fixed w-full top-0 z-40 duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* --- resto del JSX se mantiene EXACTAMENTE igual --- */}
      {/* Sección superior con logo, carrito y perfil */}
      <div className="bg-gradient-to-r from-secondary via-gray-900 to-primary text-gray-100">
        <div className="container flex justify-between items-center py-2">
          <Link
            to="/"
            className="font-bold text-2xl sm:text-3xl flex gap-2 hover:text-primary transition"
          >
            <img src={Logo} alt="Logo" className="w-10" /> Kallewear
          </Link>

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-primary to-secondary text-white py-1 px-4 rounded-full flex items-center gap-3 cursor-pointer hover:opacity-90 transition">
              <span className="hidden sm:block">Carrito</span>
              <MyCart />
            </div>

            {isGuest ? (
              <button
                onClick={handleLoginPopup}
                className="bg-gradient-to-r from-primary to-secondary text-white py-1 px-4 rounded-full flex items-center gap-3 hover:opacity-90 transition"
              >
                <span className="hidden sm:block">Login</span>
                <FiLogIn className="text-xl text-white" />
              </button>
            ) : (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 rounded-full px-3 py-1 bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition"
                >
                  <img
                    src={userInfo?.imagen || "/default-avatar.png"}
                    alt="Perfil"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="hidden sm:block">
                    {isLoading ? "Cargando..." : displayNombre.trim() || "Usuario"}
                  </span>
                  <FaCaretDown
                    className={`duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-md z-50">
                    <ul className="flex flex-col">
                      <li>
                        <Link
                          to="/perfil"
                          className="block px-4 py-2 hover:bg-primary/20"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          Ver perfil
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/carrito"
                          className="block px-4 py-2 hover:bg-primary/20"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          Ver carrito
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-primary/20"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            <DarkMode />
          </div>
        </div>
      </div>

      {/* Menú principal */}
      <div
        data-aos="zoom-in"
        className="bg-white text-black flex justify-center shadow-inner"
      >
        <ul className="sm:flex hidden items-center gap-6">
          {MenuConfig.map((item) => {
            if (!hasPermiso(item.permisos, userPermisos)) return null;

            return item.subLinks ? (
              <li key={item.id} className="group relative cursor-pointer">
                <span className="flex items-center gap-[2px] py-3 hover:text-primary transition">
                  {item.name}
                  <FaCaretDown className="group-hover:rotate-180 duration-200" />
                </span>
                <div className="absolute hidden group-hover:block w-[150px] rounded-md bg-white p-2 text-black shadow-md z-50">
                  <ul>
                    {item.subLinks
                      .filter((sub) => hasPermiso(sub.permisos, userPermisos))
                      .map((sub) => (
                        <li key={sub.id}>
                          <Link
                            to={sub.link}
                            className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </li>
            ) : (
              <li key={item.id}>
                <Link
                  to={item.link}
                  className="inline-block px-4 py-3 hover:text-primary transition duration-200"
                >
                  {item.name}
                </Link>
              </li>
            );
          })}

          <li className="group relative cursor-pointer">
            <span className="flex items-center gap-[2px] py-3 hover:text-primary transition">
              Kallewear
              <FaCaretDown className="group-hover:rotate-180 duration-200" />
            </span>
            <div className="absolute hidden group-hover:block w-[200px] rounded-md bg-white p-2 text-black shadow-md z-50">
              <ul>
                {DropdownLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      to={link.link}
                      className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
