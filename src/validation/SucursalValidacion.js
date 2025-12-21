import * as Yup from "yup";

export const SucursalValidacion = Yup.object().shape({
  locales: Yup.string()
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo se permiten letras")
    .max(100, "Máximo 100 caracteres")
    .required("El nombre del local es obligatorio"),

  descripcion: Yup.string()
    .trim()
    .max(200, "Máximo 200 caracteres")
    .required("La descripción es obligatoria"),
});
