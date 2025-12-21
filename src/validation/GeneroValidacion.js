import * as Yup from "yup";

export const GeneroValidacion = Yup.object().shape({
  tipo: Yup.string()
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo se permiten letras")
    .max(20, "Máximo 20 caracteres")
    .required("El genero es obligatorio"),
});
