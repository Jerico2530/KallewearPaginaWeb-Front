import * as Yup from "yup";

export const UserRolValidacion = Yup.object().shape({
  usuarioId: Yup.number()
    .typeError("Debes seleccionar un tipo de usuario")
    .integer("El usuario debe ser un número entero")
    .min(1, "Selecciona un usuario válido")
    .required("El usuario es obligatorio"),

  rolId: Yup.number()
    .typeError("Debes seleccionar un tipo de rol")
    .integer("El rol debe ser un número entero")
    .min(1, "Selecciona un rol válido")
    .required("El rol es obligatorio"),
});
