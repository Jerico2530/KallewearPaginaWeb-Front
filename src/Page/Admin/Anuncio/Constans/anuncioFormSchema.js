export const anuncioFormSchema = {
  imagen: {
    label: "Imagen",
    type: "text",
    placeholder: "URL de la imagen",
    table: {
      type: "image",
      editable: {
        type: "text",
        placeholder: "URL de la imagen",
      },
    },
  },

  titulo: {
    label: "Título",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },

  descripcion: {
    label: "Descripción",
    component: "textarea",
    table: {
      className: "table-important",
      editable: { type: "textarea" },
    },
  },

  fechaInicio: {
    label: "Fecha Inicio",
    type: "date",
    table: {
      type: "date",
      className: "table-text",
      editable: {
        type: "date",
      },
    },
  },

  fechaFinal: {
    label: "Fecha Final",
    type: "date",
    table: {
      type: "date",
      className: "table-text",
      editable: {
        type: "date",
      },
    },
  },

  orden: {
    label: "Orden",
    type: "number",
    constraints: {
      min: 1, // mínimo 1, no permite 0
      step: 1,
    },
    table: {
      className: "table-important",
      editable: {
        type: "number",
        constraints: {
          min: 1,
          step: 1,
        },
      },
    },
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
