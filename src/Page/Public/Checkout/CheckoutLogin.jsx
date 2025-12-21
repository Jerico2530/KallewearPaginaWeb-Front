/**
 * CheckoutLogin.jsx
 *
 * Descripción del proyecto:
 * Su propósito es solicitar al usuario su correo electrónico para iniciar sesión
 * y continuar con el proceso de compra, integrando un login global mediante popup.
 *
 * Funcionalidades clave:
 * 1. Mostrar un paso de progreso visual del checkout (Carro → Entrega → Pago).
 * 2. Solicitar correo electrónico para identificar al usuario.
 * 3. Explicar la unificación de cuentas entre diferentes marcas del grupo.
 * 4. Abrir un popup de login global al hacer clic en "Continuar".
 */
import React from "react";
import { FaTags } from "react-icons/fa";
import usePopupStore from "../../../store/popupStore";

const CheckoutLogin = () => {
  const toggleLoginPopup = usePopupStore((state) => state.toggleLoginPopup); // Abrir popup global de login
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Paso de progreso del checkout */}
      <div className="flex items-center justify-center mb-8 w-full max-w-2xl">
        <div className="flex items-center w-full">
          {/* Paso 1 - Carro */}
          <div className="flex flex-col items-center w-1/3 relative">
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shadow-lg">
              1
            </div>
            <p className="text-sm mt-2 font-medium text-gray-800">Carro</p>
            <div className="absolute top-5 left-full w-full h-1 bg-green-600"></div>
          </div>

          {/* Paso 2 - Entrega */}
          <div className="flex flex-col items-center w-1/3 relative">
            <div className="w-10 h-10 rounded-full border-2 border-green-600 bg-white text-green-600 flex items-center justify-center font-bold shadow-md">
              2
            </div>
            <p className="text-sm mt-2 font-medium text-gray-800">Entrega</p>
            <div className="absolute top-5 left-full w-full h-1 bg-gray-300"></div>
          </div>

          {/* Paso 3 - Pago */}
          <div className="flex flex-col items-center w-1/3">
            <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold shadow-inner">
              3
            </div>
            <p className="text-sm mt-2 font-medium text-gray-500">Pago</p>
          </div>
        </div>
      </div>

      {/* Card principal con formulario de correo */}
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
        {/* Logos */}
        <div className="flex justify-center items-center space-x-6 mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Falabella_Logo.svg/2560px-Falabella_Logo.svg.png"
            alt="Falabella"
            className="h-6"
          />
          <img
            src="https://seeklogo.com/images/S/sodimac-logo-7C6BB7F36C-seeklogo.com.png"
            alt="Sodimac"
            className="h-6"
          />
          <img
            src="https://seeklogo.com/images/T/tottus-logo-9D7C24E6DB-seeklogo.com.png"
            alt="Tottus"
            className="h-6"
          />
        </div>

        {/* Título y explicación */}
        <h2 className="text-lg font-semibold mb-2 text-center">
          Ingresa tu correo electrónico para continuar
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Tu cuenta de{" "}
          <span className="text-green-600 font-medium">falabella.com</span>,{" "}
          <span className="text-red-600 font-medium">Sodimac</span> y{" "}
          <span className="text-green-700 font-medium">Tottus</span> es la
          misma. Úsala si ya estás registrado.
        </p>

        {/* Input para correo electrónico */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Correo electrónico:
          </label>
          <input
            type="email"
            id="email"
            placeholder="Ingresa correo electrónico"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Botón Continuar */}
        <button
          onClick={toggleLoginPopup} // 🔹 ahora abre el login global
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
        >
          <FaTags className="text-xl" /> Continuar
        </button>
      </div>
    </div>
  );
};

export default CheckoutLogin;
