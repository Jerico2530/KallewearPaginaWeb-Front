/**
 * Página de Administración de Direcciones
 *
 * Propósito del componente:
 *   - Gestionar el CRUD de direcciones de usuarios desde el panel administrativo.
 *   - Permitir edición en línea, selección de usuario y validación de datos antes de guardar.
 *
 * Funcionalidades clave dentro del proyecto:
 *   - Formularios controlados y separados para creación y edición.
 *   - Uso de React Query mediante el hook useDireccionAdmin para mantener los datos sincronizados.
 *   - Tabla interactiva con renderizado personalizado para campos select y estados.
 *   - Opción de exportación a Excel sin afectar el estado interno.
 *   - Interfaz moderna, responsiva y compatible con modo oscuro.
 */

import React from "react";
import Select from "react-select";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useForm } from "../LogicaAdmin/useForm";
import { DireccionInicial } from "../../../constants/direccionConstantes";
import { DireccionValidacion } from "../../../validation/direccionValidacion";
import { useDireccionAdmin } from "./Logica/useDireccionAdmin";
import { useUsuarios } from "../../../hooks/useUsuario";
import { direccionFormSchema } from "./Constans/direccionFormSchema";
import { tableRenderers } from "./Constans/tableRenderers";
import { DynamicField } from "./Constans/DynamicField";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ExcelButton,
} from "../../../components/UI/LogicaButton";

const DireccionesPageAdmin = () => {
  const nuevoDireccionForm = useForm(DireccionInicial, DireccionValidacion);
  const editDireccionForm = useForm(DireccionInicial, DireccionValidacion);

  const {
    Direcciones,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useDireccionAdmin(nuevoDireccionForm, editDireccionForm);

  const { data: usuarios = [] } = useUsuarios();
  const usuarioOptions = usuarios.map((u) => ({
    value: u.usuarioId,
    label: u.nombreCompleto,
  }));

  /* ================== Generar columnas dinámicas ================== */
  const columns = Object.entries(direccionFormSchema)
    .filter(([, schema]) => schema.table)
    .map(([key, schema]) => ({
      key,
      label: schema.label,
      className: schema.table.className || "",
      render: (row) => {
        const type = schema.table.type;
        return tableRenderers[type]
          ? tableRenderers[type](row[key], row, { usuarios })
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
                        label: m.nombreCompleto,
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
    const valido = await nuevoDireccionForm.validate();
    if (!valido) return;
    handleCrear();
  };

  return (
    <PageCrud activeTab="direccion">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* HEADER */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Direcciones
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* ================= FORMULARIO ================= */}
          <aside className="w-full md:w-[300px] self-start sticky top-6 h-fit bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nuevo Direccion
            </h2>

            <div className="space-y-3">
              {Object.entries(direccionFormSchema).map(([key, config]) => {
                if (!DireccionInicial.hasOwnProperty(key)) return null;
                return (
                  <DynamicField
                    key={key}
                    fieldKey={key}
                    config={config}
                    value={nuevoDireccionForm.values[key]}
                    error={nuevoDireccionForm.errors[key]}
                    onChange={nuevoDireccionForm.handleChange}
                    optionsData={{
                      usuarios: usuarioOptions,
                    }}
                  />
                );
              })}
              <div className="flex justify-end pt-2">
                <AddButton onClick={handleCrearConValidacion} label="Agregar" />
              </div>
            </div>
          </aside>

          {/* ================= TABLA ================= */}
          <section className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="heading-block">Direcciones</h2>
              <ExcelButton onClick={descargarExcel} />
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando direcciones...
              </p>
            ) : (
              <DataTable
                data={Direcciones}
                keyField="direccionId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editDireccionForm.values}
                onEditChange={editDireccionForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (d) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(d)} />
                      <DeleteButton
                        onClick={() => handleEliminar(d.direccionId)}
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

export default DireccionesPageAdmin;
