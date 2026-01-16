export const productoFormSchema = {
  imagen: {
    label: "Imagen",
    type: "text",
    placeholder: "URL de la imagen",
    table: {
      type: "image",
      editable: {
        type: "text",
        placeholder: "URL de la imagen",
      },
    },
  },

  nombre: {
    label: "Nombre",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },
  descripcion: {
    label: "Descripcion",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },
  precio: {
    label: "Precio",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },

  monedaNombre: {
    label: "Moneda",
    table: {
      type: "monedaNombre",
      className: "table-text",
      editable: {
        type: "select",
        component: "select",
        options: [],
        parseValue: (v) => Number(v),
      },
    },
  },

  generoNombre: {
    label: "Género",
    table: {
      type: "generoNombre",
      className: "table-text",
      editable: {
        type: "select",
        component: "select",
        options: [],
        parseValue: (v) => Number(v),
      },
    },
  },

   monedaId: {
    label: "Moneda",
    component: "select",
    options: [], 
  },

  generoId: {
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
