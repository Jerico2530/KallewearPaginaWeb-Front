export const pagoFormSchema = {
  codigoOperacion: {
    label: "Código Operación",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },
  ordenNombre: {
    label: "Orden",
    table: {
      type: "ordenNombre", // <-- clave
      className: "table-text",
    },
  },
  medioPagoNombre: {
    label: "Medio Pago",
    table: {
      type: "medioPagoNombre", // <-- clave
      className: "table-text",
    },
  },
  ordenId: {
    label: "Orden",
    component: "select",
    options: [],
  },

  medioPagoId: {
    label: "Medio Pago",
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
