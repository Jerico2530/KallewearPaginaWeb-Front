export const noticiaFormSchema = {
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

  titulo: {
    label: "Título",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },
  descripcion: {
    label: "Descripción",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },
  fechaPublicacion: {
    label: "Fecha Publicación",
    type: "date",
    table: {
      type: "date",
      className: "table-text",
      editable: {
        type: "date",
      },
    },
  },
  fechaRegistro: {
    label: "Fecha de registro",
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
