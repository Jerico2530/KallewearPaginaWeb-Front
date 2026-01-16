export const carritoFormSchema = {
  cantidad: {
    label: "Cantidad",
    type: "number",
    table: {
      className: "table-important",
      editable: { type: "number" },
    },
  },
  precioUnitario: {
    label: "Precio Unitario",
    type: "number",
    table: {
      className: "table-important",
      editable: { type: "number" },
    },
  },
  usuarioPagoNombre: {
    label: "Usuario",
    table: {
      type: "usuarioPagoNombre", // <-- clave
      className: "table-text",
    },
  },
  productoTallaNombre: {
    label: "Producto Talla",
    table: {
      type: "productoTallaNombre", // <-- clave
      className: "table-text",
    },
  },
  usuarioId: {
    label: "Usuario",
    component: "select",
    options: [], 
  },

  productoTallaId: {
    label: "Género",
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

