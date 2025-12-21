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
  columns, // Configuración de cada columna (etiqueta, llave, render, editable, etc.)
  data, // Datos a mostrar en la tabla
  keyField, // Propiedad o función que identifica de manera única cada fila
  editId, // ID del elemento que se encuentra actualmente en modo edición
  editData, // Datos que se están editando
  onEditChange, // Handler para actualizar los valores en la edición
  onSave, // Acción para guardar cambios
  onCancel, // Acción para cancelar la edición
  actions, // Render de íconos o botones de acciones por fila
  enableSearch = true,
  extraHeader, // Elementos opcionales para el encabezado (botones, iconos, etc.)
}) => {
  /**
   * Estado interno para el texto del buscador.
   * No se expone fuera del componente, por lo que es local.
   */
  const [searchText, setSearchText] = useState("");

  // Filtra cualquier columna visible que tenga texto
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;

    const lower = searchText.toLowerCase();

    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];

        if (value == null) return false;

        // Comparación para booleanos → textos "activo" / "inactivo"
        if (typeof value === "boolean") {
          const boolText = value ? "activo" : "inactivo";
          return boolText.includes(lower);
        }

        // Intento de tratar fechas: compara formatos legibles y simples
        if (value instanceof Date || col.key.toLowerCase().includes("fecha")) {
          const fecha = new Date(value);
          const fechaTexto = fecha
            .toLocaleDateString("es-PE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
            .toLowerCase(); // ej. "12 de marzo de 2024"

          const fechaSimple = fecha.toLocaleDateString().toLowerCase(); // ej. "12/03/2024"

          return (
            fechaTexto.includes(lower) ||
            fechaSimple.includes(lower) ||
            fecha.getFullYear().toString().includes(lower)
          );
        }

        // Texto normal
        return value.toString().toLowerCase().includes(lower);
      })
    );
  }, [searchText, data, columns]);

  return (
    <div className="overflow-auto max-h-[70vh] rounded-lg">
      {/* 🔍 Buscador y elementos extra en header (solo si están habilitados) */}
      {(enableSearch || extraHeader) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {/* 🔍 Buscador */}
          {enableSearch && (
            <div className="flex items-center gap-2 flex-grow">
              <span className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                🔍
              </span>

              <input
                type="text"
                placeholder="Buscar"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="
            w-full px-3 py-2 rounded-lg border 
            dark:bg-gray-800 dark:border-gray-700 dark:text-white
            focus:ring-2 focus:ring-blue-500 outline-none
            text-sm sm:text-base
          "
              />
            </div>
          )}

          {/* Acciones o botones personalizados en el encabezado */}
          {extraHeader && (
            <div className="flex items-center gap-2 whitespace-nowrap">
              {extraHeader}
            </div>
          )}
        </div>
      )}

      {/* Tabla */}
      <table className="min-w-full border-collapse text-left text-gray-700 dark:text-gray-100 text-sm sm:text-base">
        {/* Encabezados dinámicos según la configuración de columnas */}
        <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`p-2 sm:p-3 font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap text-xs sm:text-sm md:text-base ${
                  col.className || ""
                }`}
              >
                {col.label}
              </th>
            ))}
            {/* Espacio reservado para la columna de acciones si existe */}
            {actions && (
              <th className="p-2 sm:p-3 text-center font-semibold">Acciones</th>
            )}
          </tr>
        </thead>

        {/* Render dinámico de filas, con edición inline si está activa */}
        <tbody>
          {filteredData && filteredData.length > 0 ? ( // 🔍 ahora usa filteredData
            filteredData.map((item) => {
              const id =
                typeof keyField === "function"
                  ? keyField(item)
                  : item[keyField];
              const isEditing = editId === id;

              return (
                <tr
                  key={id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`p-1 sm:p-3 align-middle ${
                        isEditing && col.editable
                          ? "min-w-[120px]"
                          : "max-w-[150px] sm:max-w-xs truncate"
                      } ${col.className || ""}`}
                    >
                      {/* Si está en edición → campo input / render personalizado */}
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
                            className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 transition text-xs sm:text-sm"
                          />
                        )
                      ) : col.render ? (
                        // Render personalizado cuando no es editable
                        col.render(item)
                      ) : (
                        <span
                          className="truncate block overflow-hidden text-ellipsis whitespace-nowrap text-xs sm:text-sm md:text-base"
                          title={item[col.key]}
                        >
                          {item[col.key]}
                        </span>
                      )}
                    </td>
                  ))}

                  {/* Acciones por fila (guardar/cancelar en edición o acciones comunes) */}
                  {actions && (
                    <td className="p-1 sm:p-3 align-middle text-center whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1 sm:gap-2 min-w-max">
                          {React.cloneElement(actions.saveIcon, {
                            onClick: onSave,
                          })}
                          {React.cloneElement(actions.cancelIcon, {
                            onClick: onCancel,
                          })}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 sm:gap-2 min-w-max">
                          {actions.render(item)}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            // Mensaje si no se encuentran datos
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center py-4 sm:py-6 text-gray-500 dark:text-gray-400 text-xs sm:text-sm"
              >
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
