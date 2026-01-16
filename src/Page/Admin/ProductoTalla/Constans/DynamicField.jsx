// DynamicField.jsx
import React from "react";
import Select from "react-select"; // ✅ IMPORTAR Select
import { NumberInput } from "../../../../utils/NumberInput";

export const DynamicField = ({ fieldKey, config, value, error, onChange, optionsData = {} }) => {
  // ===== Preparar opciones para selects =====
  let options = config.options || [];
  if (fieldKey === "tallaId") options = [{ value: "", label: "Seleccione..." }, ...(optionsData.tallas || [])];
  if (fieldKey === "productoId") options = [{ value: "", label: "Seleccione..." }, ...(optionsData.productos || [])];

  // ===== SELECT =====
  if (config.component === "select") {
    return (
      <div className="space-y-1">
        <label className="text-secondary text-xs font-medium">{config.label}</label>
        <Select
          options={options}
          value={options.find((o) => o.value === value) || null}
          onChange={(selected) => onChange(fieldKey, selected?.value || "")}
          placeholder={options[0]?.label || "Seleccione..."}
          isClearable
          classNames={{
            control: () =>
              "rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 focus:ring-2 focus:ring-indigo-500",
          }}
        />
        {error && <span className="text-error text-xs">{error}</span>}
      </div>
    );
  }

  // ===== NUMBER INPUT =====
  if (config.type === "number") {
    return (
      <div className="space-y-1">
        <label className="text-secondary text-xs font-medium">{config.label}</label>
        <NumberInput
          value={value ?? ""}
          onChange={(v) => onChange(fieldKey, v)}
          constraints={config.constraints} // min, max, step
        />
        {error && <span className="text-error text-xs">{error}</span>}
      </div>
    );
  }

  // ===== INPUT DE TEXTO =====
  return (
    <div className="space-y-1">
      <label className="text-secondary text-xs font-medium">{config.label}</label>
      <input
        type={config.type || "text"}
        value={value}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        className={`w-full rounded-md px-3 py-2 border text-body bg-gray-50 dark:bg-gray-950 ${
          error ? "border-red-500 focus:ring-red-400" : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
        } focus:outline-none focus:ring-2`}
      />
      {error && <span className="text-error text-xs">{error}</span>}
    </div>
  );
};

export default DynamicField;
