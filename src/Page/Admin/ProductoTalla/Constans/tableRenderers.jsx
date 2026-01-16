export const tableRenderers = {
  image: (value) => (
    <img
      src={value}
      alt="perfil"
      className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-300 dark:ring-gray-600"
    />
  ),

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

  tallaNombre: (_, row, extra) => {
    const talla = extra?.tallas?.find((r) => r.tallaId === row.tallaId);
    return talla ? talla.tipoTalla : "-";
  },
  stock: (value) => {
  const safeValue = Number(value);
  return safeValue > 0 ? safeValue : "-";
},

};
