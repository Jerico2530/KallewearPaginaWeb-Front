/**
 * Página de Administración de Monedas
 *
 * Propósito del componente:
 *   - Gestionar el CRUD de monedas dentro del panel administrativo.
 *   - Presentar una interfaz profesional con formulario y tabla editable.
 *
 * Funcionalidades clave del proyecto:
 *   - Formulario con validación para agregar nuevas monedas.
 *   - Edición directamente desde la tabla con control de estado.
 *   - Exportación de datos a Excel para descarga del usuario.
 *   - Integración total con React Query para flujo de datos optimizado.
 */
/**
 * Página de Administración de Monedas
 * ----------------------------------------------------
 * - CRUD de monedas
 * - React Query
 * - Tipografía centralizada (typography.css)
 * - Layout idéntico a UsuariosPageAdmin
 */
import React from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useForm } from "../LogicaAdmin/useForm";
import { monedaFormSchema } from "./Constans/monedaFormSchema";
import { tableRenderers } from "./Constans/tableRenderers";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ExcelButton,
} from "../../../components/UI/LogicaButton";
import { useMonedasAdmin } from "./Logica/useMonedaAdmin";
import { MonedaInicial } from "../../../constants/monedaConstantes";
import { MonedaValidacion } from "../../../validation/MonedaValidacion";

const MonedasPageAdmin = () => {
  const nuevoMonedaForm = useForm(MonedaInicial, MonedaValidacion);
  const editMonedaForm = useForm(MonedaInicial, MonedaValidacion);

  const {
    monedas,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useMonedasAdmin(nuevoMonedaForm, editMonedaForm);

  const columns = Object.entries(monedaFormSchema)
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

              if (config.table.editable.type === "select") {
                return (
                  <select
                    value={value ? "true" : "false"}
                    onChange={(e) => onChange(key, e.target.value === "true")}
                    className="w-full rounded-md px-2 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-body focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {config.table.editable.options.map((o) => (
                      <option
                        key={o.value.toString()}
                        value={o.value.toString()}
                      >
                        {o.label}
                      </option>
                    ))}
                  </select>
                );
              }
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
    const valido = await nuevoMonedaForm.validate();
    if (!valido) return;
    handleCrear();
  };

  return (
    <PageCrud activeTab="moneda">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* HEADER */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Monedas
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* FORMULARIO */}
          <aside className=" w-full md:w-[300px] self-start sticky top-6 h-fit bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm ">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nueva Moneda
            </h2>

            <div className="space-y-3">
              {Object.entries(monedaFormSchema).map(([key, config]) => {
                if (!MonedaInicial.hasOwnProperty(key)) return null;

                /* ===== SELECT ===== */
                if (config.component === "select") {
                  return (
                    <div key={key} className="space-y-1">
                      <label className="text-secondary text-xs font-medium">
                        {config.label}
                      </label>

                      <select
                        value={String(nuevoMonedaForm.values[key] ?? true)}
                        onChange={(e) =>
                          nuevoMonedaForm.handleChange(
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

                    <input
                      type={config.type ?? "text"}
                      value={nuevoMonedaForm.values[key]}
                      onChange={(e) =>
                        nuevoMonedaForm.handleChange(key, e.target.value)
                      }
                      className={`w-full rounded-md px-3 py-2 border text-body bg-gray-50 dark:bg-gray-950
                                      ${
                                        nuevoMonedaForm.errors[key]
                                          ? "border-red-500 focus:ring-red-400"
                                          : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
                                      }
                                      focus:outline-none focus:ring-2`}
                    />

                    {nuevoMonedaForm.errors[key] && (
                      <span className="text-error text-xs">
                        {nuevoMonedaForm.errors[key]}
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
              <h2 className="heading-block">Monedas</h2>
              <ExcelButton onClick={descargarExcel} />
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando monedas...
              </p>
            ) : (
              <DataTable
                data={monedas}
                keyField="monedaId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editMonedaForm.values}
                onEditChange={editMonedaForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (m) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(m)} />
                      <DeleteButton
                        onClick={() => handleEliminar(m.monedaId)}
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

export default MonedasPageAdmin;
