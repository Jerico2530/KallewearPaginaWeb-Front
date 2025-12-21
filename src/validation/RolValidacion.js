import * as Yup from "yup";

export const RolValidacion = Yup.object().shape({

  nombreRol: Yup.string()
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo se permiten letras")
    .max(100, "Máximo 100 caracteres")
    .required("El rol es obligatorio"),
});
