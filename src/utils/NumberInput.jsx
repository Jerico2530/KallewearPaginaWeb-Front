// NumberInput.jsx
import React from "react";

export const NumberInput = ({ value, onChange, constraints = {}, ...props }) => {
  const { min, max, step = 1 } = constraints;

  const handleChange = (e) => {
    let v = e.target.value;

    // Si borran el valor, pasamos ""
    if (v === "") {
      onChange("");
      return;
    }

    v = Number(v);
    if (Number.isNaN(v)) return;

    if (min !== undefined && v < min) v = min;
    if (max !== undefined && v > max) v = max;

    onChange(v);
  };

  return (
    <input
      type="number"
      value={value ?? ""}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      {...props}
      className="w-full rounded-md px-3 py-2 border text-body bg-gray-50 dark:bg-gray-950
                 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
};
