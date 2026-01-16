/**
 * Página de Administración de UserRoles
 * ------------------------------------------------------------------
 * Propósito del componente:
 *   - Gestionar el CRUD de UserRoles (crear, listar, editar, eliminar) dentro del panel administrativo.
 *   - Ofrecer edición en línea y validación controlada de datos.
 *
 * Funcionalidades clave del proyecto:
 *   - Manejo centralizado de estados del formulario (crear/editar).
 *   - Integración con React Query para obtener y mutar datos de forma eficiente.
 *   - Tabla interactiva con renderizado personalizado de campos y modo edición.
 *   - Exportación de datos a Excel y manejo profesional de notificaciones.
 *   - Interfaz responsiva y compatible con modo oscuro.
 */

import React from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import Select from "react-select";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ExcelButton,
} from "../../../components/UI/LogicaButton";
import { useForm } from "../LogicaAdmin/useForm";
import { useUserRolesAdmin } from "./Logica/useUserRolAdmin";
import { UserRolValidacion } from "../../../validation/UserRolValidacion";
import { UserRolInicial } from "../../../constants/userRolConstantes";
import { useUsuarios } from "../../../hooks/useUsuario";
import { useRoles } from "../../../hooks/useRol";
import { userRolFormSchema } from "./Constans/userRolFormSchema";
import { tableRenderers } from "./Constans/tableRenderers";
import { DynamicField } from "./Constans/DynamicField";

const UserRolesPageAdmin = () => {
  const nuevoUserRolForm = useForm(UserRolInicial, UserRolValidacion);
  const editUserRolForm = useForm(UserRolInicial, UserRolValidacion);

  const {
    userRoles,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useUserRolesAdmin(nuevoUserRolForm, editUserRolForm);

  const { data: usuarios = [] } = useUsuarios();
  const { data: roles = [] } = useRoles();

  const usuarioOptions = usuarios.map((u) => ({
    value: u.usuarioId,
    label: `${u.nombreCompleto} ${u.apellidoCompleto}`,
  }));

  const rolOptions = roles.map((r) => ({
    value: r.rolId,
    label: r.nombreRol,
  }));

  /* ================== Generar columnas dinámicas ================== */
  const columns = Object.entries(userRolFormSchema)
    .filter(([, schema]) => schema.table)
    .map(([key, schema]) => ({
      key,
      label: schema.label,
      className: schema.table.className || "",
      render: (row) => {
        const type = schema.table.type;
        return tableRenderers[type]
          ? tableRenderers[type](row[key], row, { usuarios, roles })
          : row[key];
      },
      editable: schema.table.editable
        ? {
            render: (data, onChange) => {
              const value = data[key];
              if (schema.table.editable.type === "select") {
                const options =
                  key === "usuarioNombre"
                    ? usuarios.map((m) => ({
                        value: m.usuarioId,
                        label: `${m.nombreCompleto} ${m.apellidoCompleto}`,
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
    const valido = await nuevoUserRolForm.validate();
    if (!valido) return;
    handleCrear();
  };

  return (
    <PageCrud activeTab="userrol">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Usuarios Rol
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* ================= FORMULARIO ================= */}
          <aside className=" w-full md:w-[300px] self-start sticky top-6 h-fit bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm ">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nuevo Usuario Rol
            </h2>

            <div className="space-y-3">
              {Object.entries(userRolFormSchema).map(([key, config]) => {
                if (!UserRolInicial.hasOwnProperty(key)) return null;
                return (
                  <DynamicField
                    key={key}
                    fieldKey={key}
                    config={config}
                    value={nuevoUserRolForm.values[key]}
                    error={nuevoUserRolForm.errors[key]}
                    onChange={nuevoUserRolForm.handleChange}
                    optionsData={{
                      usuarios: usuarioOptions,
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

          {/* ================= TABLE ================= */}
          <section className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="heading-block">Usuarios Rol</h2>
              <ExcelButton onClick={descargarExcel} />
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando usuarios rol...
              </p>
            ) : (
              <DataTable
                data={userRoles}
                keyField="userRolId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editUserRolForm.values}
                onEditChange={editUserRolForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                extra={{ usuarios, roles }}
                actions={{
                  render: (r) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(r)} />
                      <DeleteButton
                        onClick={() => handleEliminar(r.userRolId)}
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

export default UserRolesPageAdmin;
