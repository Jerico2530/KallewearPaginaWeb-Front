import * as Yup from "yup";

export const DescuentoValidacion = Yup.object().shape({
  nombreDescuento: Yup.string()
    .trim()
    .max(255, "Máximo 255 caracteres")
    .required("El nombre del descuento es obligatorio"),

  descripcion: Yup.string()
    .trim()
    .required("La  descripcion es obligatorio"),

  porcentaje: Yup.number()
    .typeError("El porcentaje debe ser un número")
    .min(0, "El porcentaje mínimo es 0")
    .max(100, "El porcentaje máximo es 100")
    .required("El porcentaje es obligatorio"),

  imagen: Yup.string()
    .trim()
    .max(200, "Máximo 200 caracteres")
    .nullable(),

  fechaInicio: Yup.date()
    .nullable()
    .typeError("La fecha de inicio no es válida")
    .required("La fechaInicio es obligatorio"),

  fechaFin: Yup.date()
    .nullable()
    .min(Yup.ref("fechaInicio"), "La fecha de fin no puede ser anterior a la de inicio")
    .typeError("La fecha de fin no es válida")
    .required("La fechaFin es obligatorio"),

});
