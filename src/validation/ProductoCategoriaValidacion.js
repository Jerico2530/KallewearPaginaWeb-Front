import * as Yup from "yup";

export const ProductoCategoriaValidacion = Yup.object().shape({
  productoId: Yup.number()
    .typeError("Debes seleccionar un tipo de producto")
    .integer("El tipo de producto debe ser un número entero")
    .min(1, "Selecciona un tipo de producto válido")
    .required("El tipo de producto es obligatorio"),

  categoriaId: Yup.number()
    .typeError("Debes seleccionar un tipo de categoria")
    .integer("El tipo de categoria debe ser un número entero")
    .min(1, "Selecciona un tipo de categoria válido")
    .required("El tipo de categoria es obligatorio"),
});
