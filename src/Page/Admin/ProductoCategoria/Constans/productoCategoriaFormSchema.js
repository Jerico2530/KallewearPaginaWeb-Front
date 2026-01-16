export const productoCategoriaFormSchema = {
  productoNombre: {
    label: "Producto",
    table: {
      type: "productoNombre",
      className: "table-text",
    },
  },
  categoriaNombre: {
    label: "Categoria",
    table: {
      type: "categoriaNombre",
      className: "table-text",
    },
  },
  productoId: {
    label: "Producto",
    component: "select",
    options: [],
  },

  categoriaId: {
    label: "Categoria",
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
