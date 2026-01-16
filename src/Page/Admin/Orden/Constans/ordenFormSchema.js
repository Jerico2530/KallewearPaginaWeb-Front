export const ordenFormSchema = {
  metodoEntrega: {
    label: "Método Entrega",
    component: "select",
    options: [
      { value: "RetiroTienda", label: "Retiro en tienda" },
      { value: "Envio", label: "Envío" },
    ],
    table: {
      className: "table-important",
      editable: {
        type: "select",
        options: [
          { value: "RetiroTienda", label: "Retiro en tienda" },
          { value: "Envio", label: "Envío" },
        ],
      },
    },
  },

  total: {
    label: "Total",
    type: "number",
    table: {
      className: "table-important",
    },
  },
  usuarioNombre: {
    label: "Usuario",
    table: {
      type: "usuarioNombre", // <-- clave
      className: "table-important",
    },
  },
  surcursalNombre: {
    label: "Sucursal",
    table: {
      type: "surcursalNombre", // <-- clave
      className: "table-important",
    },
  },
  direccionNombre: {
    label: "Dirección",
    table: {
      type: "direccionNombre", // <-- clave
      className: "table-important",
    },
  },
  usuarioId: {
    label: "Usuario",
    component: "select",
    options: [],
  },

  sucursalId: {
    label: "Sucursal",
    component: "select",
    options: [],
  },
  direccionId: {
    label: "Dirección",
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
