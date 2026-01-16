export const productoTallaFormSchema = {
  imagen: {
    label: "Foto Perfil",
    table: {
      type: "image",
    },
  },
  nombre: {
    label: "Producto",
    type: "text",
    table: {
      className: "table-important",
    },
  },
  descripcion: {
    label: "Descripcion",
    type: "text",
    table: {
      className: "table-important",
    },
  },
  precio: {
    label: "Precio",
    type: "text",
    table: {
      className: "table-important",
    },
  },
  tallaNombre: {
    label: "Talla",
    table: {
      type: "tallaNombre", // <-- clave
      className: "table-text",
    },
  },
  productoNombre: {
    label: "Producto",
    table: {
      type: "productoNombre", // <-- clave
      className: "table-text",
    },
  },
  tallaId: {
    label: "Talla",
    component: "select",
    options: [],
  },

  productoId: {
    label: "Producto",
    component: "select",
    options: [],
  },
  stock: {
    label: "Stock",
    type: "number",
    constraints: {
      min: 1, // mínimo 1, no permite 0
      step: 1,
    },
    table: {
      className: "table-important",
      editable: {
        type: "number",
        constraints: {
          min: 1,
          step: 1,
        },
      },
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
