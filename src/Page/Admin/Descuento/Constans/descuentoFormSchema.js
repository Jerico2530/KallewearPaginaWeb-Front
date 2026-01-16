export const descuentoFormSchema = {
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

  nombreDescuento: {
    label: "Nombre",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },

  porcentaje: {
    label: "Porcentaje",
    type: "number",
    constraints: {
      min: 1,
      max: 100,
      step: 1,
    },
    table: {
      className: "table-text",
      editable: {
        type: "number",
        constraints: {
          min: 1,
          max: 100,
          step: 1,
        },
      },
    },
  },

  fechaInicio: {
    label: "Inicio",
    type: "date",
    table: {
      type: "date",
      className: "table-text",
      editable: { type: "date" },
    },
  },

  fechaFin: {
    label: "Fin",
    type: "date",
    table: {
      type: "date",
      className: "table-text",
      editable: { type: "date" },
    },
  },

  fechaRegistro: {
    label: "Registro",
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
