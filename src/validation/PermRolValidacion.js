import * as Yup from "yup";

export const PermRolValidacion = Yup.object().shape({
  permisoId: Yup.number()
    .typeError("Debes seleccionar un tipo de permiso")
    .integer("El tipo de permiso debe ser un número entero")
    .min(1, "Selecciona un tipo de permiso válido")
    .required("El tipo de permiso es obligatorio"),

  rolId: Yup.number()
    .typeError("Debes seleccionar un tipo de rol válido")
    .integer("El tipo de rol debe ser un número entero")
    .min(1, "Selecciona un tipo de rol válido")
    .required("El tipo de rol es obligatorio"),
});
