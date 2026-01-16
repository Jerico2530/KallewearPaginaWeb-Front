export const tablePermRolRenderers = {
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

  permisoNombre: (_, row, extra) => {
    const permiso = extra?.permisos?.find((u) => u.permisoId === row.permisoId);
    return permiso ? permiso.nombrePermiso : "-";
  },

  rolNombre: (_, row, extra) => {
    const rol = extra?.roles?.find((r) => r.rolId === row.rolId);
    return rol ? rol.nombreRol : "-";
  },
};
