export const permRolFormSchema = {
  permisoNombre: {
    label: "Permiso",
    table: {
      type: "permisoNombre", // <-- clave
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

  permisoId: {
    label: "Permiso",
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
