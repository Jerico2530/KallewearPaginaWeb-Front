import * as Yup from "yup";

export const InfoTarjetaValidacion = Yup.object().shape({
  detalleTarjetaId: Yup.number()
    .required("Debe tener un Detalle Tarjeta válido."),

  medioPagoId: Yup.number()
    .typeError("Debe seleccionar un Medio Pago válido.")
    .moreThan(0, "Debe seleccionar un Medio Pago válido.")
    .required("Debe seleccionar un Medio Pago válido."),
});
