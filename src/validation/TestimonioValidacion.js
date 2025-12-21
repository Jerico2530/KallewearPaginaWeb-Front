import * as Yup from "yup";

export const TestimonioValidacion = Yup.object().shape({
  descripcion: Yup.string()
    .trim()
    .required("La descripción es obligatoria"),

  usuarioId: Yup.number()
    .typeError("El usuario es obligatorio")
    .integer("El usuario debe ser un número entero")
    .min(1, "Selecciona un usuario válido")
    .required("El usuario es obligatorio"),

  evaluacion: Yup.number()
    .typeError("La evaluación debe ser un número")
    .min(0, "La evaluación mínima es 0")
    .max(5, "La evaluación máxima es 5")
    .required("La evaluación es obligatoria"),
});
