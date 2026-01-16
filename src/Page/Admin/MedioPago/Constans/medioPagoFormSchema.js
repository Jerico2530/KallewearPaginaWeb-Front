export const medioPagoFormSchema = {
  descripcionMedioPago: {
    label: "Medio Pago",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },
  tipoPagoNombre: {
    label: "Tipo Pago",
    table: {
      type: "tipoPagoNombre",
      className: "table-text",
    },
  },
  tipoPagoId: {
    label: "Tipo Pago",
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
