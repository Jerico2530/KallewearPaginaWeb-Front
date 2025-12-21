import * as Yup from "yup";

export const HistoriaValidacion = Yup.object().shape({

  año: Yup.date()
    .max(new Date(), "No puede ser una fecha futura")
    .required("El año es obligatorio"),

  titulo: Yup.string()
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ0-9\s.,;:_@¡!¿?'"()\-\/&]+$/, "Contiene caracteres no permitidos")
    .max(100, "Máximo 100 caracteres")
    .required("El título es obligatorio"),

  descripcion: Yup.string()
    .trim()
    .required("La descripción es obligatoria"),
});
