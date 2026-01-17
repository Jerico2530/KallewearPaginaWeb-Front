export const tableRenderers = {
  image: (value) => {
    if (!value) return "-";

    return (
      <img
        src={value}
        alt="img"
        className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
      />
    );
  },
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

  monedaNombre: (_, row, extra) => {
    const moneda = extra?.monedas?.find((m) => m.monedaId === row.monedaId);
    return moneda ? moneda.nombre : "-";
  },

  generoNombre: (_, row, extra) => {
    const genero = extra?.generos?.find((g) => g.generoId === row.generoId);
    return genero ? genero.tipo : "-";
  },
};
