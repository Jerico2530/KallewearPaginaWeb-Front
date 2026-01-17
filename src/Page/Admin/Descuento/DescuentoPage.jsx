/**
 * Página de Administración de Descuentos
 * ----------------------------------------------------
 * - CRUD de descuentos
 * - React Query
 * - Tipografía centralizada (typography.css)
 * - Layout idéntico a UsuariosPageAdmin
 */
import React from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useForm } from "../LogicaAdmin/useForm";
import { descuentoFormSchema } from "./Constans/descuentoFormSchema";
import { tableRenderers } from "./Constans/tableRenderers";
import { NumberInput } from "../../../utils/NumberInput";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ExcelButton,
} from "../../../components/UI/LogicaButton";
import { DescuentoInicial } from "../../../constants/descuentoConstantes";
import { DescuentoValidacion } from "../../../validation/DescuentoValidacion";
import { useDescuentoAdmin } from "./Logica/useDescuentoAdmin";

const DescuentoPageAdmin = () => {
  const nuevoDescuentoForm = useForm(DescuentoInicial, DescuentoValidacion);
  const editDescuentoForm = useForm(DescuentoInicial, DescuentoValidacion);

  const {
    descuentos,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useDescuentoAdmin(nuevoDescuentoForm, editDescuentoForm);

  const columns = Object.entries(descuentoFormSchema)
    .filter(([, config]) => config.table)
    .map(([key, config]) => ({
      key,
      label: config.label,
      className: config.table.className,

      render: (row) => {
        const type = config.table.type;
        if (!type) return row[key];

        return tableRenderers[type]
          ? tableRenderers[type](row[key], row)
          : row[key];
      },

      editable: config.table.editable
        ? {
            render: (data, onChange) => {
              const value = data[key];

              /* ===== NUMBER INPUT ===== */
              if (config.table.editable.type === "number") {
                return (
                  <NumberInput
                    value={value ?? ""}
                    onChange={(v) => onChange(key, v)}
                    constraints={
                      config.table.editable.constraints || config.constraints
                    }
                  />
                );
              }

              /* ===== SELECT ===== */
              if (config.table.editable.type === "select") {
                return (
                  <select
                    value={value ? "true" : "false"}
                    onChange={(e) =>
                      onChange(
                        key,
                        config.table.editable.parseValue
                          ? config.table.editable.parseValue(e.target.value)
                          : e.target.value === "true"
                      )
                    }
                    className="w-full rounded-md px-2 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-body focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {config.table.editable.options.map((o) => (
                      <option key={String(o.value)} value={String(o.value)}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                );
              }

              /* ===== INPUT TEXTO ===== */
              return (
                <input
                  type={config.table.editable.type || "text"}
                  value={value ?? ""}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-full rounded-md px-2 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-body focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              );
            },
          }
        : undefined,
    }));

  const handleCrearConValidacion = async () => {
    const valido = await nuevoDescuentoForm.validate();
    if (!valido) return;
    handleCrear();
  };

  return (
    <PageCrud activeTab="descuento">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* HEADER */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Descuentos
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* FORMULARIO */}
          <aside className=" w-full md:w-[300px] self-start sticky top-6 h-fit bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm ">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nuevo Descuento
            </h2>

            <div className="space-y-3">
              {Object.entries(descuentoFormSchema).map(([key, config]) => {
                if (!DescuentoInicial.hasOwnProperty(key)) return null;

                /* ===== SELECT ===== */
                if (config.component === "select") {
                  return (
                    <div key={key} className="space-y-1">
                      <label className="text-secondary text-xs font-medium">
                        {config.label}
                      </label>

                      <select
                        value={
                          nuevoDescuentoForm.values.estado ? "true" : "false"
                        }
                        onChange={(e) =>
                          nuevoDescuentoForm.handleChange(
                            key,
                            e.target.value === "true"
                          )
                        }
                        className="w-full rounded-md px-3 py-2 border text-body bg-gray-50 dark:bg-gray-950 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {config.options.map((o) => (
                          <option key={String(o.value)} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
                /* ===== INPUT ===== */
                return (
                  <div key={key} className="space-y-1">
                    <label className="text-secondary text-xs font-medium">
                      {config.label}
                    </label>

                    {config.type === "number" ? (
                      <NumberInput
                        value={nuevoDescuentoForm.values[key]}
                        onChange={(v) =>
                          nuevoDescuentoForm.handleChange(key, v)
                        }
                        constraints={config.constraints}
                      />
                    ) : (
                      <input
                        type={config.type ?? "text"}
                        value={
                          config.type === "date" &&
                          nuevoDescuentoForm.values[key]
                            ? nuevoDescuentoForm.values[key].slice(0, 10)
                            : nuevoDescuentoForm.values[key]
                        }
                        onChange={(e) =>
                          nuevoDescuentoForm.handleChange(key, e.target.value)
                        }
                        className={`w-full rounded-md px-3 py-2 border text-body bg-gray-50 dark:bg-gray-950
                        ${
                          nuevoDescuentoForm.errors[key]
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
                        }
                          focus:outline-none focus:ring-2`}
                      />
                    )}

                    {nuevoDescuentoForm.errors[key] && (
                      <span className="text-error text-xs">
                        {nuevoDescuentoForm.errors[key]}
                      </span>
                    )}
                  </div>
                );
              })}

              <div className="flex justify-end pt-2">
                <AddButton onClick={handleCrearConValidacion} label="Agregar" />
              </div>
            </div>
          </aside>

          {/* TABLA */}
          <section className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="heading-block">Descuentos</h2>
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando descuentos...
              </p>
            ) : (
              <DataTable
                data={descuentos}
                keyField="descuentoId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editDescuentoForm.values}
                onEditChange={editDescuentoForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (d) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(d)} />
                      <DeleteButton
                        onClick={() => handleEliminar(d.descuentoId)}
                      />
                    </div>
                  ),
                  saveIcon: <SaveButton onClick={handleGuardar} />,
                  cancelIcon: <CancelButton onClick={handleCancelar} />,
                }}
              />
            )}
          </section>
        </div>
      </div>
    </PageCrud>
  );
};

export default DescuentoPageAdmin;
