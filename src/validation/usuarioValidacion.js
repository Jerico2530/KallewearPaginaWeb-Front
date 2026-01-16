import * as Yup from "yup";

export const usuarioValidacion = Yup.object().shape({
  nombreCompleto: Yup.string()
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo se permiten letras")
    .min(3, "Debe tener al menos 3 caracteres")
    .max(50, "Máximo 50 caracteres")
    .required("El nombre es obligatorio"),

  apellidoCompleto: Yup.string()
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo se permiten letras")
    .min(3, "Debe tener al menos 3 caracteres")
    .max(50, "Máximo 50 caracteres")
    .required("El apellido es obligatorio"),

  fechaNacimiento: Yup.date()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("La fecha es inválida")
    .required("La fecha es obligatoria")
    .max(new Date(), "La fecha no puede ser futura")
    .test("edad-minima", "Debe ser mayor de 18 años", (value) => {
      if (!value) return false;
      const hoy = new Date();
      const edadMinima = new Date(
        hoy.getFullYear() - 18,
        hoy.getMonth(),
        hoy.getDate()
      );
      return value <= edadMinima;
    }),
  dni: Yup.string()
    .matches(/^\d{8}$/, "El DNI debe tener 8 dígitos")
    .required("El DNI es obligatorio"),

  imagen: Yup.string().url("Debe ser una URL válida").nullable(),

  correoElectronico: Yup.string()
    .trim()
    .lowercase()
    .email("Correo electrónico no válido")
    .matches(/^[\w.+-]+@gmail\.com$/, "Solo se permiten correos @gmail.com")
    .required("El correo es obligatorio"),

  contraseña: Yup.string()
    .required("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(
      /[A-Z]/,
      "La contraseña debe contener al menos una letra mayúscula"
    )
    .matches(
      /[a-z]/,
      "La contraseña debe contener al menos una letra minúscula"
    )
    .matches(/[0-9]/, "La contraseña debe contener al menos un número")
    .matches(
      /[@$!%*?&]/,
      "La contraseña debe contener al menos un carácter especial (@$!%*?&)"
    ),

  contraseñaVisible: Yup.string()
    .oneOf([Yup.ref("contraseña"), null], "Las contraseñas no coinciden")
    .required("Debe confirmar la contraseña"),
});

export const usuarioEditarValidacion = Yup.object().shape({
  nombreCompleto: Yup.string()
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo se permiten letras")
    .min(3, "Debe tener al menos 3 caracteres")
    .max(50, "Máximo 50 caracteres"),

  apellidoCompleto: Yup.string()
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo se permiten letras")
    .min(3, "Debe tener al menos 3 caracteres")
    .max(50, "Máximo 50 caracteres"),

  fechaNacimiento: Yup.date().max(new Date(), "La fecha no puede ser futura"),

  dni: Yup.string().matches(/^\d{8}$/, "El DNI debe tener 8 dígitos"),

  imagen: Yup.string().url("Debe ser una URL válida").nullable(),

  correoElectronico: Yup.string()
    .trim()
    .lowercase()
    .email("Correo electrónico no válido")
    .matches(/^[\w.+-]+@gmail\.com$/, "Solo se permiten correos @gmail.com"),
});
