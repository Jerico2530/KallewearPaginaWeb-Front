import * as Yup from "yup";

export const NoticiasValidacion = Yup.object().shape({
  titulo: Yup.string()
    .trim()
    .max(100, "Máximo 100 caracteres")
    .required("El título es obligatorio"),

  descripcion: Yup.string()
    .trim()
    .required("La descripción es obligatoria"),

  imagen: Yup.string()
    .trim()
    .url("Debe ser una URL válida"),

  fechaPublicacion: Yup.date()
    .max(new Date(), "La fecha no puede ser futura")
    .required("La fecha de publicación es obligatoria"),
});
