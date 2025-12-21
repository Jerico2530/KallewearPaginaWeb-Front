import * as Yup from "yup";

export const OrdenValidacion = Yup.object().shape({
  usuarioId: Yup.number()
    .typeError("Debe seleccionar un usuario válido.")
    .moreThan(0, "Debe seleccionar un usuario válido."),

  sucursalId: Yup.number()
    .typeError("Debe seleccionar un sucursal válido.")
    .moreThan(0, "Debe seleccionar un sucursal válido."),

  metodoEntrega: Yup.string()
    .trim()
    .required("El Metodo Entrega es obligatorio.")
    .max(20, "El Metodo Entrega no puede tener más de 20 caracteres."),

  direccionId: Yup.number()
    .typeError("Debe seleccionar un Direccion válido.")
    .moreThan(0, "Debe seleccionar un Direccion válido."),
});
