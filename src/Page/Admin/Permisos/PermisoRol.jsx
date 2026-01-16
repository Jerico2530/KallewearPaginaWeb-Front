/**
 * Página de Administración de Permisos de Rol
 * ------------------------------------------------------------------
 * Propósito del componente:
 *   - Gestionar el CRUD de permisos de rol dentro del panel administrativo.
 *   - Ofrecer edición en línea y validación controlada de datos.
 *
 * Funcionalidades clave del proyecto:
 *   - Manejo centralizado de estados del formulario (crear/editar).
 *   - Integración con React Query para obtener y mutar datos de forma eficiente.
 *   - Tabla interactiva con renderizado personalizado de campos y modo edición.
 *   - Interfaz responsiva y compatible con modo oscuro.
 */

/**
 * Página de Administración de Permisos de Rol
 * ----------------------------------------------------
 * - CRUD de Permisos de Rol
 * - React Query
 * - Tipografía centralizada (typography.css)
 */

import React from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useForm } from "../LogicaAdmin/useForm";
import { PermRolValidacion } from "../../../validation/PermRolValidacion";
import { usePermRolAdmin } from "./Logica/usePermRolAdmin";
import { PermRolInicial } from "../../../constants/permRolConstantes";
import { permRolFormSchema } from "./Constans/permRolFormSchema";
import { tablePermRolRenderers } from "./Constans/tablePermRolRenderers";
import { DynamicField } from "./Constans/DynamicField";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ExcelButton,
} from "../../../components/UI/LogicaButton";

import { usePermisos } from "../../../hooks/usePermiso";
import { useRoles } from "../../../hooks/useRol";


const UserPermRolPageAdmin = () => {
  const nuevoPermisoRolForm = useForm(PermRolInicial, PermRolValidacion);
  const editPermisoRolForm = useForm(PermRolInicial, PermRolValidacion);

  const {
    permRoles,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = usePermRolAdmin(nuevoPermisoRolForm, editPermisoRolForm);

  const { data: permisos = [] } = usePermisos();
  const { data: roles = [] } = useRoles();

  const permisoOptions = permisos.map((m) => ({
    value: m.permisoId,
    label: m.nombrePermiso,
  }));
  const rolOptions = roles.map((r) => ({ 
    value: r.rolId, 
    label: r.nombreRol 
  }));

  /* ================== Generar columnas dinámicas ================== */
  const columns = Object.entries(permRolFormSchema)
    .filter(([, schema]) => schema.table)
    .map(([key, schema]) => ({
      key,
      label: schema.label,
      className: schema.table.className || "",
      render: (row) => {
        const type = schema.table.type;
        return tablePermRolRenderers[type]
          ? tablePermRolRenderers[type](row[key], row, { permisos, roles })
          : row[key];
      },
      editable: schema.table.editable
        ? {
            render: (data, onChange) => {
              const value = data[key];
              if (schema.table.editable.type === "select") {
                const options =
                  key === "permisoNombre"
                    ? permisos.map((m) => ({
                        value: m.permisoId,
                        label: m.nombrePermiso,
                      }))
                    : key === "rolNombre"
                    ? roles.map((g) => ({
                        value: g.rolId,
                        label: g.nombreRol,
                      }))
                    : schema.table.editable.options;

                return (
                  <select
                    value={value ?? ""}
                    onChange={(e) =>
                      onChange(
                        key,
                        schema.table.editable.parseValue
                          ? schema.table.editable.parseValue(e.target.value)
                          : e.target.value
                      )
                    }
                    className="w-full rounded-md px-2 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-body focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {options.map((o) => (
                      <option key={String(o.value)} value={String(o.value)}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                );
              }

              return (
                <input
                  type={schema.table.editable.type || "text"}
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
    <PageCrud activeTab="permrol">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Permisos de Rol
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* ================= FORMULARIO ================= */}
          <aside className="w-full md:w-[300px] self-start sticky top-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nuevo Permiso Rol
            </h2>

            <div className="space-y-3">
              {Object.entries(permRolFormSchema).map(([key, config]) => {
                if (!PermRolInicial.hasOwnProperty(key)) return null;
                return (
                  <DynamicField
                    key={key}
                    fieldKey={key}
                    config={config}
                    value={nuevoPermisoRolForm.values[key]}
                    error={nuevoPermisoRolForm.errors[key]}
                    onChange={nuevoPermisoRolForm.handleChange}
                    optionsData={{
                      permisos: permisoOptions,
                      roles: rolOptions,
                    }}
                  />
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
              <h2 className="heading-block">Permisos Rol</h2>
              <ExcelButton onClick={descargarExcel} />
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando permisos rol...
              </p>
            ) : (
              <DataTable
                data={permRoles}
                keyField="permRolId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editPermisoRolForm.values}
                onEditChange={editPermisoRolForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (r) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(r)} />
                      <DeleteButton
                        onClick={() => handleEliminar(r.permRolId)}
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

export default UserPermRolPageAdmin;
