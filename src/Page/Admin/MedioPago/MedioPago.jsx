/**
 * Página de Administración de Medio Pago
 *
 * Propósito del componente:
 *   - Gestionar operaciones CRUD del catálogo de Medios de Pago desde el panel administrativo.
 *   - Permitir edición en línea y validación del formulario antes de crear registros.
 *
 * Funcionalidades clave del proyecto:
 *   - Manejo independiente de estados de formularios para creación y edición.
 *   - Integración con librerías de estado remoto y hooks personalizados.
 *   - Tabla editable con renderizado dinámico de campos y acciones configurables.
 *   - UI responsiva, con soporte para modo oscuro y mejora de accesibilidad.
 */
/**
 * Página de Administración de MedioPago
 * ----------------------------------------------------
 * - CRUD de MedioPago
 * - React Query
 * - Tipografía centralizada (typography.css)
 * - Layout idéntico a UsuariosPageAdmin
 */
import React from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useForm } from "../LogicaAdmin/useForm";
import { MedioPagoInicial } from "../../../constants/medioPagoConstantes";
import { MedioPagoValidacion } from "../../../validation/medioPagoValidacion";
import { useMedioPagosAdmin } from "./Logica/useMedioPagoAdmin";
import { useTipoPagos } from "../../../hooks/useTipoPago";
import { medioPagoFormSchema } from "./Constans/medioPagoFormSchema";
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
import Select from "react-select";

const MedioPagoPageAdmin = () => {
  const nuevoMedioPagoForm = useForm(MedioPagoInicial, MedioPagoValidacion);
  const editMedioPagoForm = useForm(MedioPagoInicial, MedioPagoValidacion);

  const {
    medioPagos,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useMedioPagosAdmin(nuevoMedioPagoForm, editMedioPagoForm);

  const { data: tipoPagos = [] } = useTipoPagos();
  const tipoPagoOptions = tipoPagos.map((m) => ({
    value: m.tipoPagoId,
    label: m.descripcionTipoPago,
  }));

  /* ================== Generar columnas dinámicas ================== */
  const columns = Object.entries(medioPagoFormSchema)
    .filter(([, schema]) => schema.table)
    .map(([key, schema]) => ({
      key,
      label: schema.label,
      className: schema.table.className || "",
      render: (row) => {
        const type = schema.table.type;
        return tableRenderers[type]
          ? tableRenderers[type](row[key], row, { tipoPagos })
          : row[key];
      },
      editable: schema.table.editable
        ? {
            render: (data, onChange) => {
              const value = data[key];
              if (schema.table.editable.type === "select") {
                const options =
                  key === "tipoPagoNombre"
                    ? monedas.map((m) => ({
                        value: m.tipoPagoId,
                        label: m.descripcionTipoPago,
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
    const valido = await nuevoMedioPagoForm.validate();
    if (!valido) return;
    handleCrear();
  };

  return (
    <PageCrud activeTab="medioPago">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* HEADER */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de MedioPago
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* ================= FORMULARIO ================= */}
          <aside className="w-full md:w-[300px] self-start sticky top-6 h-fit bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nuevo MedioPago
            </h2>

            <div className="space-y-3">
              {Object.entries(medioPagoFormSchema).map(([key, config]) => {
                if (!MedioPagoInicial.hasOwnProperty(key)) return null;
                return (
                  <DynamicField
                    key={key}
                    fieldKey={key}
                    config={config}
                    value={nuevoMedioPagoForm.values[key]}
                    error={nuevoMedioPagoForm.errors[key]}
                    onChange={nuevoMedioPagoForm.handleChange}
                    optionsData={{
                      tipoPagos: tipoPagoOptions,
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
              <h2 className="heading-block">Medios de Pago</h2>
              <ExcelButton onClick={descargarExcel} />
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">Cargando...</p>
            ) : (
              <DataTable
                data={medioPagos}
                keyField="medioPagoId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editMedioPagoForm.values}
                onEditChange={editMedioPagoForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (t) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(t)} />
                      <DeleteButton
                        onClick={() => handleEliminar(t.medioPagoId)}
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

export default MedioPagoPageAdmin;
