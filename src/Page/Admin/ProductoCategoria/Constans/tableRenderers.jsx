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

  productoNombre: (_, row, extra) => {
    const producto = extra?.productos?.find((u) => u.productoId === row.productoId);
    return producto ? producto.nombre: "-";
  },

  categoriaNombre: (_, row, extra) => {
    const categoria = extra?.categorias?.find((r) => r.categoriaId === row.categoriaId);
    return categoria ? categoria.desCategoria : "-";
  },
};
