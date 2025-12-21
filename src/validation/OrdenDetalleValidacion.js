import * as Yup from "yup";
export const OrdenDetalleValidacion = Yup.object().shape({
  ordenId: Yup.number()
    .typeError("Debe seleccionar un orden válido.")
    .moreThan(0, "Debe seleccionar un orden válido."),

  productoId: Yup.number()
    .typeError("Debe seleccionar un producto válido.")
    .moreThan(0, "Debe seleccionar un producto válido."),

  cantidad: Yup.number()
    .typeError("Debe seleccionar un cantidad válido.")
    .moreThan(0, "Debe seleccionar un cantidad válido."),

  precioUnitario: Yup.number()
    .typeError("El precio unitario debe ser un número.")
    .min(0, "El precio unitario no puede ser negativo."),
});
