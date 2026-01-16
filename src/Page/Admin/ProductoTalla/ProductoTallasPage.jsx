/**
 * Página de Administración de Producto-Talla
 * ------------------------------------------------------------------
 * Propósito del componente:
 *   - Gestionar el CRUD de Producto-Tallas (crear, listar, editar, eliminar) dentro del panel administrativo.
 *   - Ofrecer edición en línea y validación controlada de datos.
 *
 * Funcionalidades clave del proyecto:
 *   - Manejo centralizado de estados del formulario (crear/editar).
 *   - Integración con React Query para obtener y mutar datos de forma eficiente.
 *   - Tabla interactiva con renderizado personalizado de campos y modo edición.
 *   - Exportación de datos a Excel.
 *   - Interfaz responsiva y compatible con modo oscuro.
 */

import React from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import Select from "react-select";
import { useForm } from "../LogicaAdmin/useForm";
import { ProductoTallaValidacion } from "../../../validation/ProductoTallaValidacion";
import { useProductoTallasAdmin } from "./Logica/useProductoTallaAdmin";
import { ProductoTallaInicial } from "../../../constants/productoTallaConstantes";
import { useProductos } from "../../../hooks/useProducto";
import { useTallas } from "../../../hooks/useTalla";
import { productoTallaFormSchema } from "./Constans/productoTallaFormSchema";
import { tableRenderers } from "./Constans/tableRenderers";
import { DynamicField } from "./Constans/DynamicField";
import { NumberInput } from "../../../utils/NumberInput";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ExcelButton,
} from "../../../components/UI/LogicaButton";

const ProductoTallasPageAdmin = () => {
  const nuevoProductoTallaForm = useForm(
    ProductoTallaInicial,
    ProductoTallaValidacion
  );
  const editProductoTallaForm = useForm(
    ProductoTallaInicial,
    ProductoTallaValidacion
  );

  const {
    productoTallas,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useProductoTallasAdmin(nuevoProductoTallaForm, editProductoTallaForm);

  const { data: productos = [] } = useProductos();
  const { data: tallas = [] } = useTallas();

  const productoOptions = productos.map((p) => ({
    value: p.productoId,
    label: p.nombre,
  }));
  const tallaOptions = tallas.map((t) => ({
    value: t.tallaId,
    label: t.tipoTalla,
  }));

  /* ================== Generar columnas dinámicas ================== */
  const columns = Object.entries(productoTallaFormSchema)
    .filter(([, schema]) => schema.table)
    .map(([key, schema]) => ({
      key,
      label: schema.label,
      className: schema.table.className || "",
      render: (row) => {
        const type = schema.table.type;
        return tableRenderers[type]
          ? tableRenderers[type](row[key], row, { tallas, productos })
          : row[key];
      },
      editable: schema.table.editable
        ? {
            render: (data, onChange) => {
              const value = data[key];

              // 1️⃣ Campo numérico
              if (schema.table.editable.type === "number") {
                return (
                  <NumberInput
                    value={value ?? ""}
                    onChange={(v) => onChange(key, v)}
                    constraints={schema.table.editable.constraints} // min, max, step
                  />
                );
              }

              // 2️⃣ Campo select
              if (schema.table.editable.type === "select") {
                const options =
                  key === "tallaNombre"
                    ? tallas.map((m) => ({
                        value: m.tallaId,
                        label: m.tipoTalla,
                      }))
                    : key === "productoNombre"
                    ? productos.map((g) => ({
                        value: g.productoId,
                        label: g.nombre,
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

              // 3️⃣ Fallback para input de texto
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
    const valido = await nuevoProductoTallaForm.validate();
    if (!valido) return;
    handleCrear();
  };

  return (
    <PageCrud activeTab="productoTalla">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* HEADER */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Producto-Talla
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* FORMULARIO */}
          <aside className="w-full md:w-[300px] self-start sticky top-6 h-fit bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nuevo Producto Talla
            </h2>

            <div className="space-y-3">
              {Object.entries(productoTallaFormSchema).map(([key, config]) => {
                if (!ProductoTallaInicial.hasOwnProperty(key)) return null;
                return (
                  <DynamicField
                    key={key}
                    fieldKey={key}
                    config={config}
                    value={nuevoProductoTallaForm.values[key]}
                    error={nuevoProductoTallaForm.errors[key]}
                    onChange={nuevoProductoTallaForm.handleChange}
                    optionsData={{
                      tallas: tallaOptions,
                      productos: productoOptions,
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
              <h2 className="heading-block">Producto-Tallas</h2>
              <ExcelButton onClick={descargarExcel} />
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando Producto-Tallas...
              </p>
            ) : (
              <DataTable
                data={productoTallas}
                keyField="productoTallaId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editProductoTallaForm.values}
                onEditChange={editProductoTallaForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (r) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(r)} />
                      <DeleteButton
                        onClick={() => handleEliminar(r.productoTallaId)}
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

export default ProductoTallasPageAdmin;
