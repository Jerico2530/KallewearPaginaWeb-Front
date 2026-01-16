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
  surcursalNombre: (_, row, extra) => {
    const surcusal = extra?.sucursales?.find((r) => r.sucursalId === row.sucursalId);
    return surcusal ? surcusal.locales : "-";
  },
  direccionNombre: (_, row, extra) => {
    const direccion = extra?.direcciones?.find((r) => r.direccionId === row.direccionId);
    return direccion ? `${direccion.distrito} ${direccion.provincia}`: "-";
  },
};
