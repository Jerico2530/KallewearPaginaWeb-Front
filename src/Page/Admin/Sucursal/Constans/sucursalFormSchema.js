export const sucursalFormSchema={
    locales: {
    label: "Locales",
    type: "text",
    table: {
      className: "table-text",
      editable: { type: "text" },
    },
  },
  descripcion: {
    label: "Descripción",
    type: "text",
    table: {
      className: "table-text",
      editable: { type: "text" },
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

