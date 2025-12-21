import * as Yup from "yup";

export const MedioPagoValidacion = Yup.object().shape({
  tipoPagoId: Yup.number()
    .typeError("Debes seleccionar un tipo de pago válido")
    .integer("El tipo de pago debe ser un número entero")
    .min(1, "Selecciona un tipo de pago válido")
    .required("El tipo de pago es obligatorio"),

  descripcionMedioPago: Yup.string()
    .trim()
    .max(100, "Máximo 100 caracteres")
    .required("La descripción del medio de pago es obligatoria"),
});
