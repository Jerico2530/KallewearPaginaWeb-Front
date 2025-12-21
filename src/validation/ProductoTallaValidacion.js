import * as Yup from "yup";

export const ProductoTallaValidacion = Yup.object().shape({
  productoId: Yup.number()
    .typeError("Debes seleccionar un tipo de producto")
    .integer("El tipo de producto debe ser un número entero")
    .min(1, "Selecciona un tipo de producto válido")
    .required("El tipo de producto es obligatorio"),

  tallaId: Yup.number()
    .typeError("Debes seleccionar un tipo de talla")
    .integer("El tipo de talla debe ser un número entero")
    .min(1, "Selecciona un tipo de talla válido")
    .required("El tipo de talla es obligatorio"),

  stock: Yup.number()
    .typeError("El stock debe ser un número")
    .min(0.01, "El stock no puede ser negativo")
    .required("El stock es obligatorio"),
});
