import * as Yup from "yup";

export const DetalleTarjetaValidacion = Yup.object().shape({
  numeroTarjeta: Yup.string()
    .trim()
    .required("El Numero Tarjeta es obligatorio.")
    .max(20, "El Numero Tarjeta no puede tener más de 20 caracteres.")
    .matches(/^\d{13,20}$/, "El número de tarjeta debe contener solo dígitos y entre 13 y 20 caracteres"),

  fechaVencimiento: Yup.string()
    .trim()
    .required("La fecha de vencimiento es obligatoria.")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "El formato debe ser MM/YY"),

  cvv: Yup.string()
    .trim()
    .required("El CVV es obligatorio.")
    .max(4, "El CVV no puede tener más de 4 caracteres.")
    .matches(/^\d{3,4}$/, "El CVV debe contener solo dígitos numéricos y tener 3 o 4 caracteres"),
});
