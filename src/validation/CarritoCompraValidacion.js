import * as Yup from "yup";

export const CarritoCompraValidacion = Yup.object().shape({
  usuarioId: Yup.number()
    .typeError("Debe seleccionar un usuario válido.")
    .moreThan(0, "Debe seleccionar un usuario válido."),

  productoTallaId: Yup.number()
    .typeError("Debe seleccionar un producto válido.")
    .moreThan(0, "Debe seleccionar un producto válido."),

  cantidad: Yup.number()
    .typeError("La cantidad debe ser un número.")
    .moreThan(0, "La cantidad debe ser mayor que cero."),

  precioUnitario: Yup.number()
    .typeError("El precio unitario debe ser un número.")
    .min(0, "El precio unitario no puede ser negativo."),
});
