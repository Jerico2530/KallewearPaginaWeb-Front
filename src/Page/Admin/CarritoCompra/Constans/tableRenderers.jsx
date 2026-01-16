export const tableRenderers = {

  date: (value) => (value ? new Date(value).toLocaleDateString() : "-"),

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

  productoTallaNombre: (_, row, extra) => {
    const productoTalla = extra?.productoTallas?.find((r) => r.productoTallaId === row.productoTallaId);
    return productoTalla ? productoTalla.nombre : "-";
  },
};
