export const editableRenderers = {
  rating: ({ value, onChange, schema, field }) => {
    const min = schema.constraints?.min ?? 1;
    const max = schema.constraints?.max ?? 5;

    return (
      <select
        value={value ?? min}
        onChange={(e) => onChange(field, Number(e.target.value))}
        className="w-full rounded-md px-2 py-1.5 border
                   border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-body
                   focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        {Array.from({ length: max - min + 1 }, (_, i) => {
          const n = min + i;
          return (
            <option key={n} value={n}>
              {n} ⭐
            </option>
          );
        })}
      </select>
    );
  },

  select: ({ value, onChange, schema, field }) => (
    <select
      value={String(value)}
      onChange={(e) =>
        onChange(field, e.target.value === "true")
      }
      className="w-full rounded-md px-2 py-1.5 border
                 border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-800 text-body
                 focus:ring-2 focus:ring-indigo-500 outline-none"
    >
      {schema.options.map((o) => (
        <option key={String(o.value)} value={String(o.value)}>
          {o.label}
        </option>
      ))}
    </select>
  ),
};
