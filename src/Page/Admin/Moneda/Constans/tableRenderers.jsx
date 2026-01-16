export const tableRenderers = {
  date: (value) =>
    value ? new Date(value).toLocaleDateString() : "-",

  status: (value) => (
    <span
      className={`badge px-2 py-0.5 rounded-full ${
        value ? "text-success" : "text-error"
      }`}
    >
      {value ? "Activo" : "Inactivo"}
    </span>
  ),
};
