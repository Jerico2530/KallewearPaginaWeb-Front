
import React from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../../store/userStore";

/**
 * ProtectedRoute.jsx
 * --------------------------------------------
 * Componente de protección de rutas basado en permisos.
 * Se integra con Zustand para obtener los permisos
 * del usuario autenticado.
 *
 * Uso:
 * <Route
 *    path="/admin"
 *    element={
 *       <ProtectedRoute
 *          element={<AdminPage />}
 *          permisos={["Admin.Ver", "Admin.Crear"]} // Permisos requeridos
 *       />
 *    }
 * />

 */

const ProtectedRoute = ({ element, permisos }) => {

  // Extraemos permisos del usuario desde Zustand
  const userPermisos = useUserStore((state) => state.permisos); 

   /**
   * VALIDACIÓN DE PERMISOS
   *
   * Reglas de acceso:
   * 1️⃣ Si no hay usuario logueado → Redirecciona al login.
   * 2️⃣ Si la ruta requiere permisos y el usuario no cumple ninguno → Redirecciona.
   */
  if (permisos && !permisos.some((p) => userPermisos.includes(p))) {
    return <Navigate to="/" replace />;
  }

  // Si pasa todas las validaciones → Renderiza el componente

  return element;
};

export default ProtectedRoute;
