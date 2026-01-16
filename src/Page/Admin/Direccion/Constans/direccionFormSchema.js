export const direccionFormSchema = {
  departamento: {
    label: "Departamento",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },
  provincia: {
    label: "Provincia",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },
  distrito: {
    label: "Distrito",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },
  via: {
    label: "Via",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },
  numero: {
    label: "Número",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },
  usuarioNombre: {
    label: "Usuario",
    table: {
      type: "usuarioNombre",
      className: "table-text",
    },
  },
  usuarioId: {
    label: "Usuario",
    component: "select",
    options: [],
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
