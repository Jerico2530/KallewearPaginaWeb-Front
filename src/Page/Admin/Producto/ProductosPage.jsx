/**
 * Página de Administración de Productos
 * ------------------------------------------------------------------
 * Propósito del componente:
 *   - Gestionar el CRUD de productos dentro del panel administrativo.
 *   - Ofrecer edición en línea y validación controlada de datos.
 *
 * Funcionalidades clave:
 *   - Manejo centralizado de estados del formulario (crear/editar).
 *   - Integración con React Query para obtener y mutar datos de forma eficiente.
 *   - Tabla interactiva con renderizado personalizado de campos y modo edición.
 *   - Exportación de productos a Excel.
 *   - Interfaz responsiva y compatible con modo oscuro.
 */

import React from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useForm } from "../LogicaAdmin/useForm";
import { ProductoValidacion } from "../../../validation/ProductoValidacion";
import { useProductosAdmin } from "./Logica/useProductoAdmin";
import { ProductoInicial } from "../../../constants/productoConstantes";
import { productoFormSchema } from "./Constans/productoFormSchema";
import { tableRenderers } from "./Constans/tableRenderers";
import { useMonedas } from "../../../hooks/useMoneda";
import { useGeneros } from "../../../hooks/useGenero";
import { DynamicField } from "./Constans/DynamicField";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ExcelButton,
} from "../../../components/UI/LogicaButton";

const ProductosPageAdmin = () => {
  const nuevoProductoForm = useForm(ProductoInicial, ProductoValidacion);
  const editProductoForm = useForm(ProductoInicial, ProductoValidacion);

  const {
    productos,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useProductosAdmin(nuevoProductoForm, editProductoForm);

  /** ================= OPCIONES SELECT ================= */
  const { data: monedas = [] } = useMonedas();
  const { data: generos = [] } = useGeneros();

  const monedaOptions = monedas.map((m) => ({
    value: m.monedaId,
    label: `${m.nombre} (${m.codigo})`,
  }));

  const generoOptions = generos.map((g) => ({
    value: g.generoId,
    label: g.tipo,
  }));

  /* ================== Generar columnas dinámicas ================== */
  const columns = Object.entries(productoFormSchema)
    .filter(([, schema]) => schema.table)
    .map(([key, schema]) => ({
      key,
      label: schema.label,
      className: schema.table.className || "",
      render: (row) => {
        const type = schema.table.type;
        return tableRenderers[type]
          ? tableRenderers[type](row[key], row, { monedas, generos })
          : row[key];
      },
      editable: schema.table.editable
        ? {
            render: (data, onChange) => {
              const value = data[key];
              if (schema.table.editable.type === "select") {
                const options =
                  key === "monedaNombre"
                    ? monedas.map((m) => ({
                        value: m.monedaId,
                        label: m.nombre,
                      }))
                    : key === "generoNombre"
                    ? generos.map((g) => ({ value: g.generoId, label: g.tipo }))
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
    const valido = await nuevoProductoForm.validate();
    if (!valido) return;
    handleCrear();
  };

  return (
    <PageCrud activeTab="productos">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* ================= HEADER ================= */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Productos
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* ================= FORMULARIO ================= */}
          <aside className="w-full md:w-[300px] self-start sticky top-6 h-fit bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nuevo Producto
            </h2>
            <div className="space-y-3">
              {Object.entries(productoFormSchema).map(([key, config]) => {
                if (!ProductoInicial.hasOwnProperty(key)) return null;
                return (
                  <DynamicField
                    key={key}
                    fieldKey={key}
                    config={config}
                    value={nuevoProductoForm.values[key]}
                    error={nuevoProductoForm.errors[key]}
                    onChange={nuevoProductoForm.handleChange}
                    optionsData={{
                      monedas: monedaOptions,
                      generos: generoOptions,
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
              <h2 className="heading-block">Productos</h2>
              <ExcelButton onClick={descargarExcel} />
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando productos...
              </p>
            ) : (
              <DataTable
                data={productos}
                keyField="productoId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editProductoForm.values}
                onEditChange={editProductoForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (r) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(r)} />
                      <DeleteButton
                        onClick={() => handleEliminar(r.productoId)}
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

export default ProductosPageAdmin;
