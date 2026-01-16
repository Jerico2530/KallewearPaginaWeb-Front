/**
 * Página de Administración de Detalles de Órdenes
 * ------------------------------------------------------------------
 * Propósito del componente:
 *   - Gestionar el CRUD de detalles de órdenes dentro del panel administrativo.
 *   - Ofrecer edición en línea, validación controlada de datos y selección desde listas relacionadas.
 *
 * Funcionalidades clave del proyecto:
 *   - Manejo centralizado de estados del formulario (crear/editar).
 *   - Integración con React Query para obtener y mutar datos de forma eficiente.
 *   - Tabla interactiva con renderizado personalizado de campos y modo edición.
 *   - Interfaz responsiva y compatible con modo oscuro.
 */

import React, { useState } from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useQueryClient } from "@tanstack/react-query";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
} from "../../../components/UI/LogicaButton";
import { useOrdenes } from "../../../hooks/useOrden";
import { useProductos } from "../../../hooks/useProducto";
import Select from "react-select";
import { useForm } from "../LogicaAdmin/useForm";
import { OrdenDetalleValidacion } from "../../../validation/OrdenDetalleValidacion";
import { useOrdenDetallesAdmin } from "./Logica/useOrdenDetalleAdmin";
import { OrdenDetalleInicial } from "../../../constants/ordenDetalleConstante";
import { ordenDetalleFormSchema } from "./Constans/ordenDetalleFormSchema";
import { tableRenderers } from "./Constans/tableRenderers";

const OrdenDetallesPageAdmin = () => {
  // Formularios separados para creación y edición
  const nuevoOrdenDetalleForm = useForm(
    OrdenDetalleInicial,
    OrdenDetalleValidacion
  );
  const editOrdenDetalleForm = useForm(
    OrdenDetalleInicial,
    OrdenDetalleValidacion
  );
  // Hook que encapsula toda la lógica de negocio del módulo
  const {
    ordenDetalles,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
  } = useOrdenDetallesAdmin(nuevoOrdenDetalleForm, editOrdenDetalleForm);

  /** Opciones para selects: Ordenes y Productos */
  const { data: ordenes = [] } = useOrdenes();
  const { data: productos = [] } = useProductos();

  // Transformación de datos para react-select
  const ordeneOptions = ordenes.map((m) => ({
    value: m.ordeneId,
    label: m.metodoEntrega,
  }));

  const productoOptions = productos.map((g) => ({
    value: g.productoId,
    label: g.nombre,
  }));

  // Renderiza la etiqueta correcta desde un ID
  const renderSelectValue = (id, options) => {
    const opt = options.find((o) => o.value === id);
    return opt ? opt.label : "-";
  };

  /* ================== Generar columnas dinámicas ================== */
  const columns = Object.keys(ordenDetalleFormSchema).map((key) => {
    const schema = ordenDetalleFormSchema[key];
    return {
      key,
      label: schema.label,
      className: schema.table?.className || "",
      render: (row) =>
        schema.table?.type
          ? tableRenderers[schema.table.type](row[key], row, {
              ordenes,
              productos,
            })
          : row[key],
      editable:
        schema.component === "select"
          ? {
              render: (data, onChange) => (
                <select
                  value={data ? "true" : "false"}
                  onChange={(e) => onChange(key, e.target.value === "true")}
                  className="w-full rounded-md px-2 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-body focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {schema.options.map((o) => (
                    <option key={o.value.toString()} value={o.value.toString()}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ),
            }
          : undefined,
    };
  });

  // Validación antes de crear un nuevo registro
  const handleCrearConValidacion = async () => {
    const valido = await nuevoOrdenDetalleForm.validate();
    if (!valido) return; // Si hay errores, no continua
    handleCrear();
  };

  return (
    <PageCrud activeTab="ordenes">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* HEADER */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Órdenes Detalle
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* FORMULARIO */}
          <aside className="w-full md:w-[300px] self-start sticky top-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nueva Orden Detalle
            </h2>
            {/* Inputs dinámicos generados por la estructura del modelo */}
            <div className="space-y-3">

              {/* ===== Precio Unitario ===== */}
              <div className="space-y-1">
                <label className="text-secondary text-xs font-medium">
                  Precio Unitario
                </label>
                <input
                  type="number"
                  value={nuevoOrdenDetalleForm.values.precioUnitario}
                  onChange={(e) =>
                    nuevoOrdenDetalleForm.handleChange("total", e.target.value)
                  }
                  className={`w-full rounded-md px-3 py-2 border text-body bg-gray-50 dark:bg-gray-950 ${
                    nuevoOrdenDetalleForm.errors.precioUnitario
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
                  } focus:outline-none focus:ring-2`}
                />
                {nuevoOrdenDetalleForm.errors.precioUnitario && (
                  <span className="text-error text-xs">
                    {nuevoOrdenDetalleForm.errors.precioUnitario}
                  </span>
                )}
              </div>

              {/* ===== Cantidad ===== */}
              <div className="space-y-1">
                <label className="text-secondary text-xs font-medium">
                  Cantidad
                </label>
                <input
                  type="number"
                  value={nuevoOrdenDetalleForm.values.cantidad}
                  onChange={(e) =>
                    nuevoOrdenDetalleForm.handleChange("cantidad", e.target.value)
                  }
                  className={`w-full rounded-md px-3 py-2 border text-body bg-gray-50 dark:bg-gray-950 ${
                    nuevoOrdenDetalleForm.errors.cantidad
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
                  } focus:outline-none focus:ring-2`}
                />
                {nuevoOrdenDetalleForm.errors.cantidad && (
                  <span className="text-error text-xs">
                    {nuevoOrdenDetalleForm.errors.cantidad}
                  </span>
                )}
              </div>

              {/* ===== Orden ===== */}
              <div className="space-y-1">
                <label className="text-secondary text-xs font-medium">
                  Orden
                </label>
                <Select
                  options={ordeneOptions}
                  value={
                    ordeneOptions.find(
                      (o) => o.value === nuevoOrdenDetalleForm.values.ordenId
                    ) || null
                  }
                  onChange={(selected) =>
                    nuevoOrdenDetalleForm.handleChange(
                      "ordenId",
                      selected ? selected.value : 0
                    )
                  }
                />
                {nuevoOrdenDetalleForm.errors.ordenId && (
                  <span className="text-error text-xs">
                    {nuevoOrdenDetalleForm.errors.ordenId}
                  </span>
                )}
              </div>

              {/* ===== Producto ===== */}
              <div className="space-y-1">
                <label className="text-secondary text-xs font-medium">
                  Producto
                </label>
                <Select
                  options={productoOptions}
                  value={
                    productoOptions.find(
                      (o) => o.value === nuevoOrdenDetalleForm.values.productoId
                    ) || null
                  }
                  onChange={(selected) =>
                    nuevoOrdenDetalleForm.handleChange(
                      "productoId",
                      selected ? selected.value : 0
                    )
                  }
                  placeholder="Seleccione una producto"
                />
                {nuevoOrdenDetalleForm.errors.productoId && (
                  <span className="text-error text-xs">
                    {nuevoOrdenDetalleForm.errors.productoId}
                  </span>
                )}
              </div>

              {/* ===== Estado ===== */}
              <div className="space-y-1">
                <label className="text-secondary text-xs font-medium">
                  Estado
                </label>
                <select
                  value={nuevoOrdenDetalleForm.values.estado ? "true" : "false"}
                  onChange={(e) =>
                    nuevoOrdenDetalleForm.handleChange(
                      "estado",
                      e.target.value === "true"
                    )
                  }
                  className="w-full rounded-md px-3 py-2 border text-body bg-gray-50 dark:bg-gray-950 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
                {nuevoOrdenDetalleForm.errors.estado && (
                  <span className="text-error text-xs">
                    {nuevoOrdenDetalleForm.errors.estado}
                  </span>
                )}
              </div>

              {/* ===== Botón Agregar ===== */}
              <div className="flex justify-end pt-2">
                <AddButton onClick={handleCrearConValidacion} label="Agregar" />
              </div>
            </div>
          </aside>

          {/* TABLA */}
          <section className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="heading-block">Órdenes</h2>
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando órdenes detalle...
              </p>
            ) : (
              <DataTable
                data={ordenDetalles}
                keyField="ordenDetalleId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editOrdenDetalleForm.values}
                onEditChange={editOrdenDetalleForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (r) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(r)} />
                      <DeleteButton onClick={() => handleEliminar(r.ordenId)} />
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

export default OrdenDetallesPageAdmin;
