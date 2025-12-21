import * as Yup from "yup";

export const PagoValidacion = Yup.object().shape({
  ordenId: Yup.number()
    .typeError("La orden es obligatoria")
    .integer("Debe ser un número entero")
    .min(1, "Selecciona una orden válida")
    .required("El de la orden es obligatorio"),

  medioPagoId: Yup.number()
    .typeError("Debes seleccionar un medio de pago")
    .integer("Debe ser un número entero")
    .min(1, "Selecciona un medio de pago válido")
    .required("El medio de pago es obligatorio"),

  codigoOperacion: Yup.string()
    .trim()
    .max(100, "Máximo 100 caracteres")

});
