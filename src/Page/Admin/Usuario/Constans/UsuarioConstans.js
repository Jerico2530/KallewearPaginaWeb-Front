export const UsuarioEditar = {
  nombreCompleto: "",
  apellidoCompleto: "",
  fechaNacimiento: "",
  dni: "",
  imagen: "",
  correoElectronico: "",
  estado: true,
};

export const usuarioFormSchema = {
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

  nombreCompleto: {
    label: "Nombre",
    type: "text",
    table: {
      className: "table-important",
      editable: { type: "text" },
    },
  },

  apellidoCompleto: {
    label: "Apellido",
    type: "text",
    table: {
      className: "table-text",
      editable: { type: "text" },
    },
  },

  correoElectronico: {
    label: "Correo electrónico",
    type: "email",
    table: {
      className: "table-text",
      editable: { type: "email" },
    },
  },

  dni: {
    label: "Número Documento",
    type: "text",
  },

  fechaNacimiento: {
  label: "Fecha Nacimiento",
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

  contraseña: {
    label: "Contraseña",
    type: "password",
    formOnly: true,
  },

  contraseñaVisible: {
    label: "Repetir Contraseña",
    type: "password",
    formOnly: true,
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