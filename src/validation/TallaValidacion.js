import * as Yup from "yup";

export const TallaValidacion = Yup.object().shape({
  tipoTalla: Yup.string()
    .trim()
    .max(10, "Máximo 10 caracteres")
    .required("El tipo de talla es obligatorio"),

  descripcion: Yup.string()
    .trim()
    .required("La descripción es obligatoria"),
});
