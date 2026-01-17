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

  ordenNombre: (_, row, extra) => {
    const orden = extra?.ordenes?.find((u) => u.ordenId === row.ordenId);
    return orden ? orden.metodoEntrega : "-";
  },

  medioPagoNombre: (_, row, extra) => {
    const medioPago = extra?.medioPagos?.find((r) => r.medioPagoId === row.medioPagoId );
    return medioPago ? medioPago.descripcionMedioPago : "-";
  },
};
