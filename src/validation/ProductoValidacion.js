import * as Yup from "yup";

export const ProductoValidacion = Yup.object().shape({
  nombre: Yup.string()
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ0-9\s.,-]+$/, "Solo se permiten letras, números y signos básicos")
    .max(100, "Máximo 100 caracteres")
    .required("El nombre del producto es obligatorio"),

  descripcion: Yup.string()
    .trim()
    .required("La descripción es obligatoria"),

  precio: Yup.number()
    .typeError("El precio debe ser un número")
    .min(0.01, "El precio debe ser mayor que 0")
    .required("El precio es obligatorio"),

  monedaId: Yup.number()
    .typeError("Debes seleccionar un tipo de moneda")
    .integer("La moneda debe ser un número entero")
    .min(1, "Selecciona una moneda válida")
    .required("La moneda es obligatoria"),

  generoId: Yup.number()
    .typeError("Debes seleccionar un género")
    .integer("El género debe ser un número entero")
    .min(1, "Selecciona un género válido")
    .required("El género es obligatorio"),

  imagen: Yup.string()
    .trim()
    .url("Debe ser una URL válida")
    .max(500, "Máximo 500 caracteres"),
});
