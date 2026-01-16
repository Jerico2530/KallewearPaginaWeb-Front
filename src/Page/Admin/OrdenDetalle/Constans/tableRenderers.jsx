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

  ordenNombre: (_, row, extra) => {
    const orden = extra?.ordenes?.find((u) => u.ordenId === row.ordenId);
    return orden ? metodoEntrega.nombreCompleto: "-";
  },
  productoNombre: (_, row, extra) => {
    const producto = extra?.productos?.find((r) => r.productoId === row.productoId);
    return producto ? producto.nombre : "-";
  },
};
