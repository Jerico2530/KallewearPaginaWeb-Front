import * as Yup from "yup";

export const MonedaValidacion = Yup.object().shape({
  codigo: Yup.string()
    .trim()
    .matches(/^[A-Z]{3}$/, "Debe contener exactamente 3 letras mayúsculas (por ejemplo: USD, PEN, EUR)")
    .max(5, "Máximo 5 caracteres")
    .required("El código de la moneda es obligatorio"),

  nombre: Yup.string()
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo se permiten letras")
    .max(20, "Máximo 20 caracteres")
    .required("El nombre de la moneda es obligatorio"),

  simbolo: Yup.string()
    .trim()
    .max(5, "Máximo 5 caracteres")
    .required("El símbolo es obligatorio"),
});
