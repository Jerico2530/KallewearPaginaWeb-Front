/**
 * Hook personalizado de gestión de formularios.
 *
 * Propósito dentro del proyecto:
 *   - Centralizar el manejo de formularios dentro del panel administrativo,
 *     mejorando la reutilización del código y el mantenimiento.
 *
 * Funcionalidades clave:
 *   - Control de valores de los campos del formulario.
 *   - Manejo automático de errores de validación mediante esquemas (Yup u otros).
 *   - Limpieza rápida del formulario tras crear o cancelar acciones.
 *
 */

import { useState } from "react";

export const useForm = (initialValues, validationSchema) => {
  // Estado que almacena los valores actuales del formulario
  const [values, setValues] = useState(initialValues);
  // Estado que contiene los mensajes de error por campo
  const [errors, setErrors] = useState({});

  /**
   * Actualiza el valor de un campo específico del formulario.
   * Recibe el nombre de la propiedad (key) y su nuevo valor.
   */
  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Restablece los valores del formulario a los iniciales
   * y limpia cualquier error existente.
   */
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  /**
   * Ejecuta la validación usando el esquema recibido.
   * Retorna true si el formulario está correcto.
   */
  const validate = async () => {
    if (!validationSchema) return true;
    try {
      // Validación completa sin detenerse en el primer error
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      // Si hay errores de validación, se estructura el detalle por campo
      if (err.name === "ValidationError") {
        const formErrors = {};
        err.inner.forEach((e) => {
          formErrors[e.path] = e.message;
        });
        setErrors(formErrors);
      }
      return false;
    }
  };
  // Datos y funciones que el hook expone al componente
  return {
    values,
    errors,
    setValues,
    handleChange,
    resetForm,
    validate,
  };
};
