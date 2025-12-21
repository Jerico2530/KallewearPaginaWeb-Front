import * as Yup from "yup";

export const DireccionValidacion = Yup.object().shape({
  usuarioId: Yup.number().required("El usuario es obligatorio"),

  departamento: Yup.string()
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo se permiten letras")
    .max(200, "Máximo 200 caracteres")
    .required("El departamento es obligatorio"),

  provincia: Yup.string()
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo se permiten letras")
    .max(200, "Máximo 200 caracteres")
    .required("La provincia es obligatoria"),

  distrito: Yup.string()
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo se permiten letras")
    .max(200, "Máximo 200 caracteres")
    .required("El distrito es obligatorio"),

  via: Yup.string()
    .trim()
    .max(200, "Máximo 200 caracteres")
    .required("La vía es obligatoria"),

  numero: Yup.string()
    .trim()
    .max(200, "Máximo 200 caracteres")
    .required("El número es obligatorio"),
});
