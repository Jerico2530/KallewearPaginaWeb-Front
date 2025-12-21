import * as Yup from "yup";

export const PermisoValidacion = Yup.object().shape({
  nombrePermiso: Yup.string()
    .trim()
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.]+$/, "Solo se permiten letras, espacios y puntos")
    .max(100, "Máximo 100 caracteres")
    .required("El nombre del permiso es obligatorio"),
});
