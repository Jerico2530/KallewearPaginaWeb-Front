/**
 * Página de Administración de Anuncios
 *
 * Propósito del componente:
 *   - Gestionar el CRUD de anuncios (crear, listar, editar, eliminar) dentro del panel administrativo.
 *   - Presentar una interfaz profesional con formulario y tabla editable.
 *
 * Funcionalidades clave del proyecto:
 *   - Gestión de estados de edición con validación de formularios.
 *   - Tabla interactiva con edición en línea y exportación a Excel.
 *   - Integración con React Query para manejo de datos optimizado.
 *   - Experiencia responsiva y modo oscuro habilitado.
 *
 */

import React from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useForm } from "../LogicaAdmin/useForm";
import { AnuncioInicial } from "../../../constants/anuncioConstantes";
import { AnuncioEditar } from "./Constans/AnuncioConstans";
import { AnuncioValidacion } from "../../../validation/AnuncioValidacion";
import { useAnunciosAdmin } from "./Logica/useAnuncioAdmin";
import { anuncioFormSchema } from "./Constans/anuncioFormSchema";
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

const AnunciosPageAdmin = () => {
  const nuevoAnuncioForm = useForm(AnuncioInicial, AnuncioValidacion);
  const editAnuncioForm = useForm(AnuncioEditar, AnuncioValidacion);

  const {
    anuncios,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useAnunciosAdmin(nuevoAnuncioForm, editAnuncioForm);

  const columns = Object.entries(anuncioFormSchema)
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

              // ✅ USAR config, no schema
              if (config.table.editable.type === "number") {
                return (
                  <NumberInput
                    value={value ?? ""}
                    onChange={(v) => onChange(key, v)}
                    constraints={config.table.editable.constraints}
                  />
                );
              }

              if (config.table.editable.type === "select") {
                return (
                  <select
                    value={String(value)}
                    onChange={(e) =>
                      onChange(
                        key,
                        config.table.editable.parseValue
                          ? config.table.editable.parseValue(e.target.value)
                          : e.target.value
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
    const valido = await nuevoAnuncioForm.validate();
    if (!valido) return;
    handleCrear();
  };

  return (
    <PageCrud activeTab="publicidad">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* HEADER */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Anuncios
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* ================= FORMULARIO ================= */}
          <aside className=" w-full md:w-[300px] self-start sticky top-6 h-fit bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm ">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nuevo Anuncio
            </h2>
            <div className="space-y-3">
              {Object.entries(anuncioFormSchema).map(([key, config]) => {
                if (!AnuncioInicial.hasOwnProperty(key)) return null;

                if (config.component === "select") {
                  return (
                    <div key={key} className="space-y-1">
                      <label className="text-secondary text-xs font-medium">
                        {config.label}
                      </label>
                      <select
                        value={String(nuevoAnuncioForm.values[key])}
                        onChange={(e) =>
                          nuevoAnuncioForm.handleChange(
                            key,
                            e.target.value === "true"
                          )
                        }
                        className="w-full rounded-md px-3 py-2 border bg-gray-50 dark:bg-gray-950"
                      >
                        {config.options.map((o) => (
                          <option key={String(o.value)} value={String(o.value)}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
                if (config.component === "textarea") {
                  return (
                    <div key={key} className="space-y-1">
                      <label className="text-secondary text-xs font-medium">
                        {config.label}
                      </label>
                      <textarea
                        value={nuevoAnuncioForm.values[key] ?? ""}
                        onChange={(e) =>
                          nuevoAnuncioForm.handleChange(key, e.target.value)
                        }
                        className="w-full rounded-md px-3 py-2 border bg-gray-50 dark:bg-gray-950"
                      />
                    </div>
                  );
                }
                return (
                  <div key={key} className="space-y-1">
                    <label className="text-secondary text-xs font-medium">
                      {config.label}
                    </label>
                    {config.type === "number" ? (
                      <NumberInput
                        value={nuevoAnuncioForm.values[key] ?? ""}
                        onChange={(v) => nuevoAnuncioForm.handleChange(key, v)}
                        constraints={config.constraints}
                      />
                    ) : (
                      <input
                        type={config.type ?? "text"}
                        value={nuevoAnuncioForm.values[key] ?? ""}
                        onChange={(e) =>
                          nuevoAnuncioForm.handleChange(key, e.target.value)
                        }
                        className="w-full rounded-md px-3 py-2 border bg-gray-50 dark:bg-gray-950
               border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
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
              <h2 className="heading-block">Anuncios</h2>
              <ExcelButton onClick={descargarExcel} />
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando anuncios...
              </p>
            ) : (
              <DataTable
                data={anuncios}
                keyField="anuncioId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editAnuncioForm.values}
                onEditChange={editAnuncioForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (a) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(a)} />
                      <DeleteButton
                        onClick={() => handleEliminar(a.anuncioId)}
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

export default AnunciosPageAdmin;
