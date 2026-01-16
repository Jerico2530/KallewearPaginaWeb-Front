/**
 * Página de Administración de ProductoCategorias
 *
 * Propósito del componente:
 *   - Gestionar el CRUD de ProductoCategorias (crear, listar, editar, eliminar) dentro del panel administrativo.
 *   - Ofrecer edición en línea y validación controlada de datos.
 *
 * Funcionalidades clave del proyecto:
 *   - Manejo centralizado de estados del formulario (crear/editar).
 *   - Integración con React Query para obtener y mutar datos de forma eficiente.
 *   - Tabla interactiva con renderizado personalizado de campos y modo edición.
 *   - Interfaz responsiva y compatible con modo oscuro.
 *   - Exportación a Excel de manera confiable.
 */
/**
 * Página de Administración de ProductoCategorias
 * ----------------------------------------------------
 * - CRUD de ProductoCategorias
 * - React Query
 * - Tipografía centralizada (typography.css)
 */

import React from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useForm } from "../LogicaAdmin/useForm";
import { ProductoCategoriaValidacion } from "../../../validation/ProductoCategoriaValidacion";
import { useProductoCategoriasAdmin } from "./Logica/useProductoCategoriaAdmin";
import { ProductoCategoriaInicial } from "../../../constants/productoCategoriaConstantes";
import { useProductos } from "../../../hooks/useProducto";
import { useCategorias } from "../../../hooks/useCategoria";
import { productoCategoriaFormSchema } from "./Constans/productoCategoriaFormSchema";
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

const ProductoCategoriaCategoriaPageAdmin = () => {
  const nuevoProductoCategoriaForm = useForm(
    ProductoCategoriaInicial,
    ProductoCategoriaValidacion
  );
  const editProductoCategoriaForm = useForm(
    ProductoCategoriaInicial,
    ProductoCategoriaValidacion
  );

  const {
    productoCategorias,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useProductoCategoriasAdmin(
    nuevoProductoCategoriaForm,
    editProductoCategoriaForm
  );

  const { data: productos = [] } = useProductos();
  const { data: categorias = [] } = useCategorias();

  const productoOptions = productos.map((p) => ({
    value: p.productoId,
    label: p.nombre,
  }));
  const categoriaOptions = categorias.map((c) => ({
    value: c.categoriaId,
    label: c.desCategoria,
  }));

  /* ================== Generar columnas dinámicas ================== */
  const columns = Object.entries(productoCategoriaFormSchema)
    .filter(([, schema]) => schema.table)
    .map(([key, schema]) => ({
      key,
      label: schema.label,
      className: schema.table.className || "",
      render: (row) => {
        const type = schema.table.type;
        return tableRenderers[type]
          ? tableRenderers[type](row[key], row, { productos, categorias })
          : row[key];
      },
      editable: schema.table.editable
        ? {
            render: (data, onChange) => {
              const value = data[key];
              if (schema.table.editable.type === "select") {
                const options =
                  key === "productoNombre"
                    ? monedas.map((m) => ({
                        value: m.productoId,
                        label: m.nombre,
                      }))
                    : key === "categoriaNombre"
                    ? generos.map((g) => ({
                        value: g.categoriaId,
                        label: g.desCategoria,
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
    <PageCrud activeTab="productoCategoria">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* HEADER */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Producto Categorias
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* ================= FORMULARIO ================= */}
          <aside className=" w-full md:w-[300px] self-start sticky top-6 h-fit bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm ">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nuevo Usuario Rol
            </h2>

            <div className="space-y-3">
              {Object.entries(productoCategoriaFormSchema).map(
                ([key, config]) => {
                  if (!ProductoCategoriaInicial.hasOwnProperty(key)) return null;
                  return (
                    <DynamicField
                      key={key}
                      fieldKey={key}
                      config={config}
                      value={nuevoProductoCategoriaForm.values[key]}
                      error={nuevoProductoCategoriaForm.errors[key]}
                      onChange={nuevoProductoCategoriaForm.handleChange}
                      optionsData={{
                        productos: productoOptions,
                        categorias: categoriaOptions,
                      }}
                    />
                  );
                }
              )}
              <div className="flex justify-end pt-2">
                <AddButton onClick={handleCrearConValidacion} label="Agregar" />
              </div>
            </div>
          </aside>

          {/* TABLA */}
          <section className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="heading-block">Producto Categorias</h2>
              <ExcelButton onClick={descargarExcel} />
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando Producto Categorias...
              </p>
            ) : (
              <DataTable
                data={productoCategorias}
                keyField="productoCategoriaId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editProductoCategoriaForm.values}
                onEditChange={editProductoCategoriaForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (r) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(r)} />
                      <DeleteButton
                        onClick={() => handleEliminar(r.productoCategoriaId)}
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

export default ProductoCategoriaCategoriaPageAdmin;
