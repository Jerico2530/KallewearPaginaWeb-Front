export const tableRenderers = {
  date: (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (isNaN(date)) return "-";

    return date.toLocaleDateString("es-PE");
  },

  status: (value) => (
    <span
      className={`badge px-2 py-0.5 rounded-full ${
        value ? "text-success" : "text-error"
      }`}
    >
      {value ? "Activo" : "Inactivo"}
    </span>
  ),

  usuarioNombre: (_, row, extra) => {
    const usuario = extra?.usuarios?.find((u) => u.usuarioId === row.usuarioId);
    return usuario ? `${usuario.nombreCompleto} ${usuario.apellidoCompleto}` : "-";
  },

 
};
