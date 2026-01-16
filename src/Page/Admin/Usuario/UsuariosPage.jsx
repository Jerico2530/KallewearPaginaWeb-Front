/**
 * Página de Administración de Usuarios
 *
 * Propósito del componente:
 *   - Gestionar el CRUD de usuarios (crear, listar, editar, eliminar) dentro del panel administrativo.
 *   - Ofrecer edición en línea y validación controlada de datos.
 *
 * Funcionalidades clave del proyecto:
 *   - Manejo centralizado de estados del formulario (crear/editar).
 *   - Integración con React Query para obtener y mutar datos de forma eficiente.
 *   - Tabla interactiva con renderizado personalizado de campos y modo edición.
 *   - Interfaz responsiva y compatible con modo oscuro.
 */

import React from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useForm } from "../LogicaAdmin/useForm";
import {
  usuarioValidacion,
  usuarioEditarValidacion,
} from "../../../validation/usuarioValidacion";
import { useUsuariosAdmin } from "./Logica/useUsuariosAdmin";
import { UsuarioInicial } from "../../../constants/usuarioConstantes";
import { UsuarioEditar, usuarioFormSchema } from "./Constans/UsuarioConstans";
import { tableRenderers } from "./Constans/tableRenderers";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ExcelButton,
} from "../../../components/UI/LogicaButton";

const UsuariosPageAdmin = () => {
  const nuevoUsuarioForm = useForm(UsuarioInicial, usuarioValidacion);
  const editUsuarioForm = useForm(UsuarioEditar, usuarioEditarValidacion);

  const {
    usuarios,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useUsuariosAdmin(nuevoUsuarioForm, editUsuarioForm);

  const columns = Object.entries(usuarioFormSchema)
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
    const valido = await nuevoUsuarioForm.validate();
    if (!valido) return;
    handleCrear();
  };

  return (
    <PageCrud activeTab="usuario">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* ================= HEADER ================= */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Usuarios
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* ================= FORMULARIO ================= */}
          <aside className=" w-full md:w-[300px] self-start sticky top-6 h-fit bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm ">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nuevo Usuario
            </h2>

            <div className="space-y-3">
              {Object.entries(usuarioFormSchema).map(([key, config]) => {
                if (!UsuarioInicial.hasOwnProperty(key)) return null;

                /* ===== SELECT ===== */
                if (config.component === "select") {
                  return (
                    <div key={key} className="space-y-1">
                      <label className="text-secondary text-xs font-medium">
                        {config.label}
                      </label>

                      <select
                        value={
                          nuevoUsuarioForm.values.estado ? "true" : "false"
                        }
                        onChange={(e) =>
                          nuevoUsuarioForm.handleChange(
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
                      value={nuevoUsuarioForm.values[key]}
                      onChange={(e) =>
                        nuevoUsuarioForm.handleChange(key, e.target.value)
                      }
                      className={`w-full rounded-md px-3 py-2 border text-body bg-gray-50 dark:bg-gray-950
                        ${
                          nuevoUsuarioForm.errors[key]
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
                        }
                        focus:outline-none focus:ring-2`}
                    />

                    {nuevoUsuarioForm.errors[key] && (
                      <span className="text-error text-xs">
                        {nuevoUsuarioForm.errors[key]}
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

          {/* ================= TABLE ================= */}
          <section className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="heading-block">Usuarios</h2>
              <ExcelButton onClick={descargarExcel} />
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando usuarios...
              </p>
            ) : (
              <DataTable
                data={usuarios}
                keyField="usuarioId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editUsuarioForm.values}
                onEditChange={editUsuarioForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (u) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(u)} />
                      <DeleteButton
                        onClick={() => handleEliminar(u.usuarioId)}
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

export default UsuariosPageAdmin;
