import * as Yup from "yup";

export const CategoriaValidacion = Yup.object().shape({
  desCategoria: Yup.string()
  .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo se permiten letras")
  .max(150, "Máximo 150 caracteres")
  .required("El Categoria es obligatorio"),

});
