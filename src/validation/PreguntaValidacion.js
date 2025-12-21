import * as Yup from "yup";

export const PreguntaValidacion = Yup.object().shape({
  preguntas: Yup.string()
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ0-9\s¿?¡!.,-]+$/, "Solo se permiten letras, números y signos básicos")
    .max(400, "Máximo 400 caracteres")
    .required("La pregunta es obligatoria"),

  respuesta: Yup.string()
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ0-9\s¿?¡!.,-]+$/, "Solo se permiten letras, números y signos básicos")
    .max(800, "Máximo 800 caracteres")
    .required("La respuesta es obligatoria"),
});
