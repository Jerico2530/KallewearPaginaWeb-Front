/**
 * CheckoutCart.jsx
 *
 * Descripción del proyecto:
 * Su propósito es manejar el inicio de sesión de los usuarios antes de continuar
 * con la compra, garantizando que los datos del carrito se guarden y se pueda
 * proceder correctamente a la sección de entrega.
 *
 * Funcionalidades clave:
 * 1. Detecta si el usuario es invitado y muestra un popup de login.
 * 2. Permite al usuario continuar con la compra si ya está logueado.
 * 3. Muestra información del correo del usuario logueado.
 * 4. Integra la navegación hacia la siguiente etapa del checkout (delivery).
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import CheckoutLayout from "../Checkout/CheckoutLayout";
import LoginPopup from "../Logear/LoginPopup";
import useUserStore from "../../../store/userStore";
import Button from "../../../components/UI/Button";

const CheckoutCart = () => {
  const navigate = useNavigate();
  // Estado del usuario: invitado o registrado
  const isGuest = useUserStore((state) => state.isGuest);
  // Correo del usuario logueado
  const correoElectronico = useUserStore((state) => state.correoElectronico);

  const [loginPopup, setLoginPopup] = useState(false);

  // Mostrar popup de login si el usuario es invitado
  useEffect(() => {
    if (isGuest) setLoginPopup(true);
  }, [isGuest]);
  // Función que maneja la continuación del checkout
  const handleContinue = () => {
    if (isGuest) {
      setLoginPopup(true); // Mostrar login si es invitado
    } else {
      navigate("/checkoutDelivery"); // Navegar a la sección de entrega si está logueado
    }
  };

  return (
    <CheckoutLayout step={1}>
      {/* Contenedor principal del componente */}
      <div className="animate-fadeIn max-w-lg mx-auto p-6 flex flex-col items-center justify-center space-y-6">
        {/* 🔹 Título dinámico según el estado de login */}
        <h2 className="text-2xl font-bold text-center mb-3 text-gray-900 dark:text-white">
          {isGuest
            ? "Inicia sesión para continuar con tu compra"
            : "Confirmacion de Inicio Sesión"}
        </h2>

        {/* Descripción dinámica */}
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-8">
          {isGuest
            ? "Debes iniciar sesión para guardar tu carrito y poder continuar con la Compra ."
            : "Datos confirmado y continúa con la compra."}
        </p>

        {/* Mostrar correo si está logueado */}
        {!isGuest && (
          <div className="w-full text-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-200 mb-4">
            Comprando como:{" "}
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {correoElectronico}
            </span>
          </div>
        )}

        {/* Botón Continuar */}
        <Button
          onClick={handleContinue}
          variant="primary"
          size="md"
          className="w-full justify-center gap-2"
          icon={FaArrowRight}
        >
          {isGuest ? "Iniciar sesión" : "Continuar"}
        </Button>
      </div>

      {/*  LoginPopup */}
      <LoginPopup
        loginPopup={loginPopup}
        setLoginPopup={setLoginPopup}
        setRegisterPopup={() => {}}
        onSuccess={() => navigate("/checkoutDelivery")}
      />
    </CheckoutLayout>
  );
};

export default CheckoutCart;
