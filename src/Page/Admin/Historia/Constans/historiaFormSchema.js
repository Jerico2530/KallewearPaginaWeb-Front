export const historiaFormSchema = {
  año: {
    label: "Año",
    type: "date",
    table: {
      type: "date",
      className: "table-text",
      editable: {
        type: "date",
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
    type: "textarea",
    table: {
      className: "table-important",
      editable: { type: "textarea" },
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
