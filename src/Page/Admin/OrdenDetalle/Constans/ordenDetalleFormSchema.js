export const ordenDetalleFormSchema = {
  precioUnitario: {
    label: "Precio Unitario",
    type: "number",
    table: {
      className: "table-important",
      editable: { type: "number" },
    },
  },
  cantidad: {
    label: "Cantidad",
    type: "number",
    table: {
      className: "table-important",
      editable: { type: "number" },
    },
  },
  ordenNombre: {
    label: "Orden",
    table: {
      type: "ordenNombre", // <-- clave
      className: "table-important",
    },
  },
  productoNombre: {
    label: "Producto",
    table: {
      type: "productoNombre", // <-- clave
      className: "table-important",
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
      { value: true, label: "Activo" },
      { value: false, label: "Inactivo" },
    ],
    table: {
      type: "status",
    },
  },
};
