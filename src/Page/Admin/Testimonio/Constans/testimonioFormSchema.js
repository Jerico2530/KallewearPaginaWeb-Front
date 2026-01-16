export const testimonioFormSchema = {
  imagen: {
    label: "Imagen",
    type: "text",
    placeholder: "URL de la imagen",
    table: {
      type: "image",
    },
  },
  descripcion: {
    label: "Descripción",
    type: "textarea",
    table: {
      className: "table-important",
      editable: { type: "textarea" },
    },
  },
  evaluacion: {
    label: "Evaluación",
    type: "number",
    component: "rating",
    constraints: {
      min: 1,
      max: 5,
    },
  },

  usuarioNombre: {
    label: "Usuario",
    table: {
      type: "usuarioNombre", // <-- clave
      className: "table-important",
    },
  },
  usuarioId: {
    label: "Usuario",
    component: "select",
    options: [],
  },
  fechaRegistro: {
    label: "Fecha de registro",
    table: {
      type: "date",
      className: "table-text",
    },
  },
  estado: {
    label: "Estado",
    component: "select",
    options: [
      { value: "true", label: "Activo" },
      { value: "false", label: "Inactivo" },
    ],
    table: {
      type: "status",
      editable: {
        type: "select",
        options: [
          { value: "true", label: "Activo" },
          { value: "false", label: "Inactivo" },
        ],
        parseValue: (value) => value === "true",
      },
    },
  },
};
