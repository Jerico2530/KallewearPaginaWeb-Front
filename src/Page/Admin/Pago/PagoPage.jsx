/**
 * Página de Administración de Pagos
 * ------------------------------------------------------------------
 * Propósito del componente:
 *   - Gestionar el CRUD de pagos (crear, listar, editar, eliminar) dentro del panel administrativo.
 *   - Ofrecer edición en línea y validación controlada de datos.
 *
 * Funcionalidades clave del proyecto:
 *   - Manejo centralizado de estados del formulario (crear/editar) mediante useForm.
 *   - Integración con React Query para obtener y mutar datos de manera eficiente.
 *   - Tabla interactiva con renderizado personalizado de campos, edición en línea y acciones.
 *   - Descarga de pagos en formato Excel.
 *   - Interfaz responsiva y compatible con modo oscuro.
 */

import React from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useForm } from "../LogicaAdmin/useForm";
import { PagoInicial } from "../../../constants/pagoConsatantes";
import { PagoValidacion } from "../../../validation/pagoValidacion";
import { usePagosAdmin } from "./Logica/usePagoAdmin";
import { useOrdenes } from "../../../hooks/useOrden";
import { useMedioPagos } from "../../../hooks/useMedioPago";
import { pagoFormSchema } from "./Constans/pagoFormSchema";
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

const PagoPageAdmin = () => {
  const nuevoPagoForm = useForm(PagoInicial, PagoValidacion);
  const editPagoForm = useForm(PagoInicial, PagoValidacion);

  const {
    pagos,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = usePagosAdmin(nuevoPagoForm, editPagoForm);

  const { data: ordenes = [] } = useOrdenes();
  const { data: medioPagos = [] } = useMedioPagos();

  const ordenOptions = ordenes.map((o) => ({
    value: o.ordenId,
    label: o.metodoEntrega,
  }));
  const medioPagoOptions = medioPagos.map((m) => ({
    value: m.medioPagoId,
    label: m.descripcionMedioPago || "-",
  }));

  /* ================== Generar columnas dinámicas ================== */
  const columns = Object.entries(pagoFormSchema)
    .filter(([, schema]) => schema.table)
    .map(([key, schema]) => ({
      key,
      label: schema.label,
      className: schema.table.className || "",
      render: (row) => {
        const type = schema.table.type;
        return tableRenderers[type]
          ? tableRenderers[type](row[key], row, { ordenes, medioPagos })
          : row[key];
      },
      editable: schema.table.editable
        ? {
            render: (data, onChange) => {
              const value = data[key];
              if (schema.table.editable.type === "select") {
                const options =
                  key === "ordenNombre"
                    ? ordenes.map((m) => ({
                        value: m.ordenId,
                        label: m.metodoEntrega,
                      }))
                    : key === "medioPagoNombre"
                    ? medioPagos.map((g) => ({
                        value: g.medioPagoId,
                        label: g.descripcionMedioPago,
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
    const valido = await nuevoPagoForm.validate();
    if (!valido) return;
    handleCrear();
  };

  return (
    <PageCrud activeTab="pago">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* HEADER */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">Administración de Pagos</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* ================= FORMULARIO ================= */}
          <aside className="w-full md:w-[300px] self-start sticky top-6 h-fit bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nuevo Pago
            </h2>

            <div className="space-y-3">
              {Object.entries(pagoFormSchema).map(([key, config]) => {
                if (!PagoInicial.hasOwnProperty(key)) return null;
                return (
                  <DynamicField
                    key={key}
                    fieldKey={key}
                    config={config}
                    value={nuevoPagoForm.values[key]}
                    error={nuevoPagoForm.errors[key]}
                    onChange={nuevoPagoForm.handleChange}
                    optionsData={{
                      ordenes: ordenOptions,
                      medioPagos: medioPagoOptions,
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
              <h2 className="heading-block">Pagos</h2>
              <ExcelButton onClick={descargarExcel} />
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando pagos...
              </p>
            ) : (
              <DataTable
                data={pagos}
                keyField="pagoId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editPagoForm.values}
                onEditChange={editPagoForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (p) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(p)} />
                      <DeleteButton onClick={() => handleEliminar(p.pagoId)} />
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

export default PagoPageAdmin;
