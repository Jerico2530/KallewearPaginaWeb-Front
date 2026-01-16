export const userRolFormSchema = {
  usuarioNombre: {
    label: "Usuario",
    table: {
      type: "usuarioNombre", // <-- clave
      className: "table-important",
    },
  },

  rolNombre: {
    label: "Rol",
    table: {
      type: "rolNombre", // <-- clave
      className: "table-text",
    },
  },
  rolId: {
    label: "Rol",
    component: "select",
    options: [], 
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
