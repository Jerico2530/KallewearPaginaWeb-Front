import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLogin } from "../../../hooks/useLogin";
import { loginValidacion } from "../../../validation/loginValidacion";
import { useNotifier } from "../../../utils/useNotifier";
import { NOTIFICACIONES } from "../../../constants/notificationsConstantes";

const LoginPopup = ({ loginPopup, setLoginPopup, setRegisterPopup, onSuccess }) => {
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [errors, setErrors] = useState({});
  const { success, error } = useNotifier();

  const { mutate: login, isPending } = useLogin();

  const handleLogin = async () => {
    try {
      setErrors({});

      // Validación Yup
      await loginValidacion.validate({ correoElectronico, contraseña }, { abortEarly: false });

      // Login usando hook
      login({ correoElectronico, contraseña }, {
        onSuccess: () => {
          success(NOTIFICACIONES.LOGIN.SUCCESS); 
          setLoginPopup(false);
          if (onSuccess) onSuccess();
        },
        onError: (err) => {
          if (err?.response?.data?.errors) {
            setErrors(err.response.data.errors);
          } else {
            error(err?.response?.data?.message || NOTIFICACIONES.LOGIN.ERROR); 
          }
        },
      });
    } catch (validationError) {
      if (validationError.name === "ValidationError") {
        const newErrors = {};
        validationError.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <AnimatePresence>
      {loginPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Iniciar Sesión
              </h2>
              <IoCloseOutline
                className="text-3xl cursor-pointer text-gray-600 dark:text-gray-300 hover:text-red-500 transition-transform duration-200 hover:scale-110"
                onClick={() => setLoginPopup(false)}
              />
            </div>

            {/* Formulario */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={correoElectronico}
                  onChange={(e) => setCorreoElectronico(e.target.value)}
                  className={`w-full pl-10 pr-3 py-3 border rounded-full transition-all duration-200
                    ${errors.correoElectronico ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-primary"}
                    dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {errors.correoElectronico && (
                  <p className="text-sm text-red-500 mt-1">{errors.correoElectronico}</p>
                )}
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  className={`w-full pl-10 pr-3 py-3 border rounded-full transition-all duration-200
                    ${errors.contraseña ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-primary"}
                    dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {errors.contraseña && (
                  <p className="text-sm text-red-500 mt-1">{errors.contraseña}</p>
                )}
              </div>

              <button
                onClick={handleLogin}
                disabled={isPending}
                className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-full shadow-md hover:shadow-xl transition-all duration-300"
              >
                {isPending ? "Iniciando..." : "Iniciar sesión"}
              </button>
            </div>

            {/* Links */}
            <div className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
              <br />
              ¿No tienes una cuenta?{" "}
              <span
                onClick={() => {
                  setLoginPopup(false);
                  setRegisterPopup(true);
                }}
                className="text-primary hover:underline cursor-pointer transition"
              >
                Regístrate
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginPopup;
