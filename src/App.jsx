/**
 * App.jsx
 *
 * Descripción del proyecto:
 * Componente principal de la plataforma Kallewear, que gestiona toda la navegación
 * pública y protegida, carga inicial de usuarios invitados, y despliegue de popups.
 *
 * Funcionalidades clave:
 * 1. Inicializa animaciones AOS y carga del usuario invitado al inicio.
 * 2. Gestiona rutas públicas y privadas mediante React Router, con control de permisos.
 * 3. Muestra secciones principales de la tienda: Hero, TopProducts, Banner, Products y Testimonials.
 * 4. Maneja popups de login, registro y pedidos, así como el carrito off-canvas.
 * 5. Configura notificaciones mediante ToastContainer para feedback al usuario.
 *
 * Propósito:
 * Servir como núcleo de la aplicación, integrando todas las secciones, rutas y estados globales
 * de manera organizada y escalable, garantizando una experiencia fluida para usuarios invitados y autenticados.
 */
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./utils/ScrollToTop";

import useUserStore from "./store/userStore";
import usePopupStore from "./store/popupStore";
import { useAuthBootstrap } from "./hooks/useAuthBootstrap";

import Navbar from "./components/Layout/Navbar/Navbar";
import Footer from "./components/Layout/Footer/Footer";
import Popup from "./components/Shared/Popup/Popup";
import LoginPopup from "./Page/Public/Logear/LoginPopup";
import RegisterPopup from "./Page/Public/Logear/RegisterPopup";
import SidebarOffCanvas from "./Page/Public/Cart/SidebarOffCanvas";

import ToastProvider from "./components/UI/ToastProvider"; 

import Hero from "./components/Shared/Hero/Hero";
import TopProducts from "./Page/Public/TopProducts/TopProducts";
import Banner from "./components/Shared/Banner/Banner";
import Products from "./Page/Public/Products/Products";
import Testimonials from "./Page/Public/Testimonials/Testimonials";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ProductPage from "./Page/Public/ProductPage/ProductPage";

import { publicRoutesConfig } from "./routes/publicRoutesConfig";
import { adminRoutesConfig } from "./routes/adminRoutesConfig";

const ProtectedRoute = ({ element, permisos, userPermisos }) => {
  if (!permisos || permisos.some((p) => userPermisos.includes(p))) {
    return element;
  }
  return <Navigate to="/" replace />;
};

const App = () => {
  const {
    orderPopup,
    loginPopup,
    registerPopup,
    setOrderPopup,
    setLoginPopup,
    setRegisterPopup,
  } = usePopupStore();
  const userPermisos = useUserStore((state) => state.permisos || []);

  const { loadGuest } = useAuthBootstrap();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Esperamos a que cargue invitado solo si es necesario
      await loadGuest();
      setLoading(false);
    };
    init();

    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, [loadGuest]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Navbar
        handleOrderPopup={() => setOrderPopup(true)}
        handleLoginPopup={() => setLoginPopup(true)}
      />
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero handleOrderPopup={() => setOrderPopup(true)} />
              <TopProducts handleOrderPopup={() => setOrderPopup(true)} />

              <Banner />
              <Products />
              <Testimonials />
            </>
          }
        />

        {/* Ruta de producto individual */}
        <Route path="/producto/:productoTallaId" element={<ProductPage />} />

        {publicRoutesConfig.map(({ path, element: Element, permisos }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute
                element={<Element />}
                permisos={permisos ? [permisos] : null}
                userPermisos={userPermisos}
              />
            }
          />
        ))}

        <Route
          path="/plataformaAdmin"
          element={<Navigate to="/perfilAdmin" replace />}
        />

        {adminRoutesConfig.map(({ path, element: Element, permisos }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute
                element={<Element />}
                permisos={permisos}
                userPermisos={userPermisos}
              />
            }
          />
        ))}
      </Routes>

      <Footer />

      <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
      <LoginPopup
        loginPopup={loginPopup}
        setLoginPopup={setLoginPopup}
        setRegisterPopup={setRegisterPopup}
      />
      <RegisterPopup
        registerPopup={registerPopup}
        setRegisterPopup={setRegisterPopup}
        setLoginPopup={setLoginPopup}
      />
      <SidebarOffCanvas />
      <ToastProvider />
    </div>
  );
};

export default App;
