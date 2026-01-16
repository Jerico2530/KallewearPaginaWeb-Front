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

  const [openProducto, setOpenProducto] = useState(null);

  return (
    <div className="flex h-screen pt-[120px] overflow-hidden bg-gray-100 dark:bg-gray-950">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 flex flex-col bg-primary text-white shadow-xl border-r border-black/10">
        {/* Logo */}
        <div
          onClick={() => navigate("/perfilAdmin")}
          className="relative px-6 py-5 cursor-pointer border-b border-white/10 flex items-center gap-4 group"
        >
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-r" />

          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
            <span className="text-lg font-bold">A</span>
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-white/60">
              Panel
            </span>
            <span className="block text-base font-semibold">
              Administración
            </span>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {sidebarMenu.map((group, index) => (
            <div key={index}>
              <div
                onClick={() =>
                  setOpenProducto(openProducto === index ? null : index)
                }
                className="flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer hover:bg-white/10"
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <group.icon className="text-lg" />
                  {group.title}
                </span>
                <span
                  className={`transition-transform ${
                    openProducto === index ? "rotate-90" : ""
                  }`}
                >
                  ▶
                </span>
              </div>

              {openProducto === index && (
                <div className="pl-6 mt-1 space-y-1">
                  {group.children.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => navigate(item.path)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/10"
                    >
                      <item.icon className="text-base opacity-80" />
                      <span className="text-sm opacity-80">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 py-6 overflow-hidden">
          {/* 🔥 CONTENEDOR QUE MANEJA EL SCROLL */}
          <div className="h-full max-w-[1400px] mx-auto flex flex-col">
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageCrud;