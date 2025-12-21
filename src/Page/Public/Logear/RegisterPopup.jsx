/**
 * RegisterPopup.jsx
 *
 * Funcionalidades clave:
 * 1. Mostrar un popup modal de creación de cuenta con animaciones suaves.
 * 2. Validación de campos usando React Hook Form y Yup, con manejo de errores visibles.
 * 3. Integración con hook de creación de usuario personalizado y notificaciones de estado.
 * 4. Permite alternar entre registro y login de manera intuitiva.
 * 5. Previene la pérdida de datos si el usuario intenta cerrar el formulario sin guardar.
 *
 * Propósito:
 * Facilitar la creación de cuentas de usuario de forma segura y con experiencia interactiva
 * clara, mejorando la conversión de visitantes en usuarios registrados en la plataforma.
 */

import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCrearUsuario } from "../../../hooks/useUsuario";
import { usuarioValidacion } from "../../../validation/usuarioValidacion";
import { handleApiError } from "../../../utils/handleApiError";
import { UsuarioInicial } from "../../../constants/usuarioConstantes";
import { mapToPayload } from "./Constans/UsuarioConstansCom";
import { camposUsuario } from "./Constans/UsuarioVisualConstansCom";

// Botón de envío reutilizable con animación
const SubmitButton = ({ isSubmitting, children }) => (
  <motion.button
    type="submit"
    disabled={isSubmitting}
    className={`bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-full shadow-md 
    hover:shadow-xl transition-all duration-300 mt-2 ${
      isSubmitting ? "opacity-60 cursor-not-allowed" : ""
    }`}
  >
    {isSubmitting ? "Creando..." : children}
  </motion.button>
);

const RegisterPopup = ({ registerPopup, setRegisterPopup, setLoginPopup }) => {
  const crearUsuario = useCrearUsuario();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  // Configuración de React Hook Form con validación Yup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: UsuarioInicial,
    resolver: yupResolver(usuarioValidacion),
  });
  // Función para enviar los datos del formulario
  const onSubmit = async (data) => {
    try {
      const payload = mapToPayload(data);
      await crearUsuario.mutateAsync(payload);
      enqueueSnackbar("Usuario creado correctamente 🎉", {
        variant: "success",
      });

      reset(UsuarioInicial);
      setRegisterPopup(false);

      // Abrir el popup de login después de registrar
      setTimeout(() => {
        setLoginPopup(true);
      }, 500);

      queryClient.invalidateQueries(["usuarios"]);
    } catch (err) {
      handleApiError(err, enqueueSnackbar);
    }
  };

  // Función para cerrar el popup, con confirmación si hay cambios sin guardar
  const handleClose = () => {
    if (isDirty && !confirm("¿Deseas salir sin guardar los cambios?")) return;
    setRegisterPopup(false);
  };

  return (
    <AnimatePresence>
      {registerPopup && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay con desenfoque */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Popup modal */}
          <motion.div
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex-1 text-center">
                Crear Cuenta
              </h2>
              <IoCloseOutline
                className="text-3xl cursor-pointer text-gray-600 dark:text-gray-300 hover:text-red-500 transition-transform duration-200 hover:scale-110"
                onClick={handleClose}
              />
            </div>

            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              {camposUsuario.map(({ name, placeholder, icon, type }) => (
                <div className="relative" key={name}>
                  {icon}
                  <input
                    type={type}
                    placeholder={placeholder}
                    {...register(name)}
                    className={`w-full pl-10 pr-3 py-3 border rounded-full transition-all duration-200 
                      ${
                        errors[name]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-primary"
                      }
                      dark:bg-gray-800 text-gray-900 dark:text-white`}
                  />
                  {errors[name] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors[name]?.message}
                    </p>
                  )}
                </div>
              ))}

              <SubmitButton isSubmitting={isSubmitting}>
                Registrarse
              </SubmitButton>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterPopup;
