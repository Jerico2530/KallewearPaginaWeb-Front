/**
 * Página de Administración de Permisos
 * ------------------------------------------------------------------
 * Propósito del componente:
 *   - Gestionar el CRUD de permisos (crear, listar, editar, eliminar) dentro del panel administrativo.
 *   - Presentar una interfaz profesional con formulario de creación y tabla editable.
 *
 * Funcionalidades clave del proyecto:
 *   - Gestión de estados de edición con validación de formularios.
 *   - Tabla interactiva con edición en línea y exportación a Excel.
 *   - Integración con React Query para manejo de datos optimizado.
 *   - Experiencia responsiva y soporte de modo oscuro.
 */
/**
 * Página de Administración de Permisos
 * ----------------------------------------------------
 * - CRUD de Permisos
 * - React Query
 * - Tipografía centralizada (typography.css)
 * - Layout idéntico a UsuariosPageAdmin
 */

import React from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useForm } from "../LogicaAdmin/useForm";
import { PermisoValidacion } from "../../../validation/PermisoValidacion";
import { usePermisosAdmin } from "./Logica/usePermisoAdmin";
import { PermisoInicial } from "../../../constants/permisoConstantes";
import { permisoFormSchema } from "./Constans/permisoFormSchema";
import { tablePermisoRenderers } from "./Constans/tablePermisoRenderers";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ExcelButton,
} from "../../../components/UI/LogicaButton";

const PermisosPageAdmin = () => {
  const nuevoPermisoForm = useForm(PermisoInicial, PermisoValidacion);
  const editPermisoForm = useForm(PermisoInicial, PermisoValidacion);

  const {
    permisos,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = usePermisosAdmin(nuevoPermisoForm, editPermisoForm);

  const columns = Object.entries(permisoFormSchema)
      .filter(([, config]) => config.table)
      .map(([key, config]) => ({
        key,
        label: config.label,
        className: config.table.className,
  
        render: (row) => {
          const type = config.table.type;
          if (!type) return row[key];
  
          return tablePermisoRenderers[type]
            ? tablePermisoRenderers[type](row[key], row)
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
    const valido = await nuevoForm.validate();
    if (!valido) return;
    handleCrear();
  };

  return (
    <PageCrud activeTab="permiso">
       <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* HEADER */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Permisos
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* FORMULARIO */}
          <aside className=" w-full md:w-[300px] self-start sticky top-6 h-fit bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm ">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nuevo Permiso
            </h2>

            <div className="space-y-3">
              {Object.entries(permisoFormSchema).map(([key, config]) => {
                if (!PermisoInicial.hasOwnProperty(key)) return null;

                /* ===== SELECT ===== */
                if (config.component === "select") {
                  return (
                    <div key={key} className="space-y-1">
                      <label className="text-secondary text-xs font-medium">
                        {config.label}
                      </label>

                      <select
                        value={nuevoPermisoForm.values[key] ? "true" : "false"}
                        onChange={(e) =>
                          nuevoPermisoForm.handleChange(
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
                      value={nuevoPermisoForm.values[key]}
                      onChange={(e) =>
                        nuevoPermisoForm.handleChange(key, e.target.value)
                      }
                      className={`w-full rounded-md px-3 py-2 border text-body bg-gray-50 dark:bg-gray-950
                                   ${
                                     nuevoPermisoForm.errors[key]
                                       ? "border-red-500 focus:ring-red-400"
                                       : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
                                   }
                                   focus:outline-none focus:ring-2`}
                    />

                    {nuevoPermisoForm.errors[key] && (
                      <span className="text-error text-xs">
                        {nuevoPermisoForm.errors[key]}
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
              <h2 className="heading-block">Permisos</h2>
              <ExcelButton onClick={descargarExcel} />
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando permisos...
              </p>
            ) : (
              <DataTable
                data={permisos}
                keyField="permisoId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editPermisoForm.values}
                onEditChange={editPermisoForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (p) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(p)} />
                      <DeleteButton
                        onClick={() => handleEliminar(p.permisoId)}
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

export default PermisosPageAdmin;
