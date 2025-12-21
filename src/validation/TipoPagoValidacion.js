import * as Yup from "yup";

export const TipoPagoValidacion = Yup.object().shape({
  descripcionTipoPago: Yup.string()
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ0-9\s.-]+$/,"Solo se permiten letras, números, espacios, puntos y guiones")
    .max(50, "Máximo 50 caracteres")
    .required("El tipo de pago  es obligatorio"),
});
