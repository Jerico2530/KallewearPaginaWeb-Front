import * as Yup from "yup";

export const loginValidacion = Yup.object().shape({
  correoElectronico: Yup.string()
    .email("Correo electrónico no válido")
    .matches(/^[\w.+-]+@gmail\.com$/, "Solo se permiten correos @gmail.com")
    .required("El correo es obligatorio"),
  contraseña: Yup.string()
    .required("La contraseña es obligatoria"),
});
