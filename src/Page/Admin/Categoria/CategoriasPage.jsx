/**
 * Página de Administración de Categorías
 *
 * Propósito del componente:
 *   - Gestionar el CRUD de categorías dentro del panel administrativo.
 *   - Ofrecer una interfaz profesional de gestión mediante formulario y tabla editable.
 *
 * Funcionalidades clave del proyecto:
 *   - Validación de campos y control del estado de edición.
 *   - Tabla interactiva con edición en línea y exportación de datos a Excel.
 *   - Conexión a React Query para manejo eficiente de datos en caché.
 *   - Diseño adaptable con modo oscuro habilitado.
 */

import React from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useForm } from "../LogicaAdmin/useForm";
import { CategoriaInicial } from "../../../constants/categoriaConstantes";
import { CategoriaValidacion } from "../../../validation/CategoriaValidacion";
import { categoriaFormSchema } from "./Constants/categoriaFormSchema";
import { tableRenderers } from "./Constants/tableRenderers";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ExcelButton,
} from "../../../components/UI/LogicaButton";
import { useCategoriaAdmin } from "./Logica/useCategoriaAdmin";

const CategoriasPageAdmin = () => {
  const nuevoCategoriaForm = useForm(CategoriaInicial, CategoriaValidacion);
  const editCategoriaForm = useForm(CategoriaInicial, CategoriaValidacion);

  const {
    categorias,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useCategoriaAdmin(nuevoCategoriaForm, editCategoriaForm);

  const columns = Object.entries(categoriaFormSchema)
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
    const valido = await nuevoCategoriaForm.validate();
    if (!valido) return;
    handleCrear();
  };

  return (
    <PageCrud activeTab="categoria">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* HEADER */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Categorías
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* FORMULARIO */}
          <aside className=" w-full md:w-[300px] self-start sticky top-6 h-fit bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm ">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nueva Categoría
            </h2>

            <div className="space-y-3">
              {Object.entries(categoriaFormSchema).map(([key, config]) => {
                if (!CategoriaInicial.hasOwnProperty(key)) return null;

                /* ===== SELECT ===== */
                if (config.component === "select") {
                  return (
                    <div key={key} className="space-y-1">
                      <label className="text-secondary text-xs font-medium">
                        {config.label}
                      </label>

                      <select
                        value={
                          nuevoCategoriaForm.values[key] ? "true" : "false"
                        }
                        onChange={(e) =>
                          nuevoCategoriaForm.handleChange(
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
                      value={nuevoCategoriaForm.values[key]}
                      onChange={(e) =>
                        nuevoCategoriaForm.handleChange(key, e.target.value)
                      }
                      className={`w-full rounded-md px-3 py-2 border text-body bg-gray-50 dark:bg-gray-950
                                      ${
                                        nuevoCategoriaForm.errors[key]
                                          ? "border-red-500 focus:ring-red-400"
                                          : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
                                      }
                                      focus:outline-none focus:ring-2`}
                    />

                    {nuevoCategoriaForm.errors[key] && (
                      <span className="text-error text-xs">
                        {nuevoCategoriaForm.errors[key]}
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
              <h2 className="heading-block">Categorías</h2>
              <ExcelButton onClick={descargarExcel} />
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando categorías...
              </p>
            ) : (
              <DataTable
                data={categorias}
                keyField="categoriaId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editCategoriaForm.values}
                onEditChange={editCategoriaForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (c) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(c)} />
                      <DeleteButton
                        onClick={() => handleEliminar(c.categoriaId)}
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

export default CategoriasPageAdmin;
