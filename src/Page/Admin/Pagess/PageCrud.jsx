/**
 * Componente PageCrud
 * ------------------------------------------------------------------
 * Propósito del componente:
 *   - Proveer una plantilla general para las páginas de administración.
 *   - Contener sidebar de navegación dinámico y área principal de contenido.
 *
 * Funcionalidades clave del proyecto:
 *   - Sidebar con grupos de menú expandibles y navegación programática.
 *   - Área de contenido central con scroll independiente.
 *   - Gestión de estado interno para abrir/cerrar secciones del menú.
 *   - Compatible con modo oscuro y diseño responsivo.
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sidebarMenu } from "./sidebarMenu";

const PageCrud = ({ activeTab, children }) => {
  const navigate = useNavigate();
  // Estados para controlar la expansión de secciones del menú
  const [openProducto, setOpenProducto] = useState(false);
  const [openUsuario, setOpenUsuario] = useState(false);
  const [openPermiso, setOpenPermiso] = useState(false);

  return (
    <div className="flex h-screen pt-[120px] overflow-hidden">
      {/* Sidebar: navegación lateral del panel administrativo */}
      <aside className="w-64 bg-primary text-gray-100 flex flex-col shadow">
        {/* Logo o título del panel */}
        <div
          onClick={() => navigate("/perfilAdmin")}
          className="text-xl font-bold p-4 border-b border-gray-700 cursor-pointer text-black dark:text-white"
        >
          <span className="text-purple-500">Administración</span>
        </div>
        {/* Menú dinámico de navegación */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-2 text-base">
          {sidebarMenu.map((group, index) => (
            <div key={index}>
              {/* Título del grupo de menú, clicable para expandir/cerrar */}
              <div
                onClick={() =>
                  setOpenProducto((prev) => (prev === index ? null : index))
                }
                className="flex justify-between items-center px-3 py-3 cursor-pointer hover:bg-primary rounded text-lg"
              >
                <span className="flex items-center gap-3">
                  <group.icon className="text-xl" /> {group.title}
                </span>
                <span
                  className={`transform transition-transform ${
                    openProducto === index ? "rotate-90" : ""
                  }`}
                >
                  ▶
                </span>
              </div>

              {/* Submenú: visible solo si el grupo está expandido */}
              {openProducto === index && (
                <div className="space-y-1 pl-6 mt-1">
                  {group.children.map((item, cidx) => (
                    <div
                      key={cidx}
                      onClick={() => navigate(item.path)}
                      className="flex items-center gap-3 hover:bg-primary p-2.5 rounded cursor-pointer text-base"
                    >
                      <item.icon className="text-lg" /> {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Área principal de contenido con scroll independiente */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 w-full p-4 sm:p-6 bg-gray-50 dark:bg-gray-950 overflow-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageCrud;
