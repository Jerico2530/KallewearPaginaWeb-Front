/**
 * DataTable.jsx
 * ------------------------------------------------------------------
 * Componente genérico y reutilizable para mostrar información tabular
 * con búsqueda integrada, edición en línea y acciones personalizadas.
 *
 * Funcionalidades clave:
 * ✔ Filtrado dinámico por texto, compatible con booleanos y fechas.
 * ✔ Renderizado flexible mediante columnas configurables.
 * ✔ Soporte para edición de filas con control externo del estado.
 * ✔ Encabezado extendible con botones o acciones adicionales.
 * ✔ Optimizado con useMemo para evitar renderizados innecesarios.
 *
 * Propósito del componente:
 * Estandarizar la presentación y gestión de datos en la interfaz de
 * administración del proyecto, fortaleciendo la escalabilidad y la
 * experiencia de usuario en un contexto empresarial.
 */

import React, { useState, useMemo } from "react";

const DataTable = ({
  columns,
  data,
  keyField,
  editId,
  editData,
  onEditChange,
  onSave,
  onCancel,
  actions,
  enableSearch = true,
  extraHeader,
}) => {
  const [searchText, setSearchText] = useState("");

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;

    const lower = searchText.toLowerCase();

    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        if (value == null) return false;

        if (typeof value === "boolean") {
          return (value ? "activo" : "inactivo").includes(lower);
        }

        if (value instanceof Date || col.key.toLowerCase().includes("fecha")) {
          const fecha = new Date(value);
          return (
            fecha.toLocaleDateString().toLowerCase().includes(lower) ||
            fecha.getFullYear().toString().includes(lower)
          );
        }

        return value.toString().toLowerCase().includes(lower);
      })
    );
  }, [searchText, data, columns]);

  return (
    <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      {/* ================= HEADER ================= */}
      {(enableSearch || extraHeader) && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {enableSearch && (
            <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1">
              <div className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-muted">
                🔍
              </div>

              <input
                type="text"
                placeholder="Buscar..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="
                  w-full sm:max-w-xs
                  px-3 py-2 rounded-lg border
                  bg-white dark:bg-gray-900
                  border-gray-300 dark:border-gray-600
                  text-body
                  placeholder
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                "
              />
            </div>
          )}

          {extraHeader && (
            <div className="flex items-center gap-2">
              {extraHeader}
            </div>
          )}
        </div>
      )}

      {/* ================= TABLA ================= */}
      <div className="overflow-auto max-h-[65vh]">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="
                    px-3 py-2 text-left whitespace-nowrap
                    table-header
                  "
                >
                  {col.label}
                </th>
              ))}

              {actions && (
                <th className="px-3 py-2 text-center table-header">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item) => {
                const id =
                  typeof keyField === "function"
                    ? keyField(item)
                    : item[keyField];

                const isEditing = editId === id;

                return (
                  <tr
                    key={id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`
                          px-3 py-2 align-middle
                          table-text
                          ${
                            isEditing && col.editable
                              ? "min-w-[140px]"
                              : "max-w-[220px] truncate"
                          }
                        `}
                      >
                        {isEditing && col.editable ? (
                          col.editable.render ? (
                            col.editable.render(editData, onEditChange)
                          ) : (
                            <input
                              type={col.editable.type || "text"}
                              value={editData[col.key] ?? ""}
                              onChange={(e) =>
                                onEditChange(col.key, e.target.value)
                              }
                              className="
                                w-full px-2 py-1.5 rounded-md
                                border border-gray-300 dark:border-gray-600
                                bg-white dark:bg-gray-800
                                text-body
                                focus:outline-none focus:ring-2 focus:ring-indigo-500
                              "
                            />
                          )
                        ) : col.render ? (
                          col.render(item)
                        ) : (
                          <span
                            className="block truncate"
                            title={item[col.key]}
                          >
                            {item[col.key]}
                          </span>
                        )}
                      </td>
                    ))}

                    {actions && (
                      <td className="px-3 py-2 text-center">
                        {isEditing ? (
                          <div className="flex justify-center gap-2">
                            {React.cloneElement(actions.saveIcon, {
                              onClick: onSave,
                            })}
                            {React.cloneElement(actions.cancelIcon, {
                              onClick: onCancel,
                            })}
                          </div>
                        ) : (
                          <div className="flex justify-center gap-2">
                            {actions.render(item)}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-6 text-center text-muted"
                >
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
