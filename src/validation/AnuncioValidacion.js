import * as Yup from "yup";

export const AnuncioValidacion = Yup.object().shape({
  titulo: Yup.string()
    .trim()
    .max(100, "Máximo 100 caracteres")
    .required("El título es obligatorio"),

  descripcion: Yup.string()
    .trim()
    .max(500, "Máximo 500 caracteres")
    .required("La descripción es obligatoria"),

  fechaInicio: Yup.date()
    .required("La fecha de inicio es obligatoria"),

  fechaFinal: Yup.date()
    .min(Yup.ref("fechaInicio"), "La fecha final debe ser posterior a la de inicio")
    .required("La fecha final es obligatoria"),

  imagen: Yup.string()
    .trim()
    .url("Debe ser una URL válida")
    .nullable(),

  orden: Yup.number()
    .integer("Debe ser un número entero")
    .min(1, "Debe ser al menos 1")
    .required("El orden es obligatorio"),
});
