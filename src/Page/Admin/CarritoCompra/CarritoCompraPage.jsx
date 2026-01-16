/**
 * Página de Administración de Carrito de Compras
 *
 * Propósito del componente:
 *   - Gestionar el CRUD de carrito de compras (crear, listar, editar, eliminar) dentro del panel administrativo.
 *   - Ofrecer edición en línea y validación controlada de datos.
 *
 * Funcionalidades clave del proyecto:
 *   - Manejo centralizado de estados del formulario (crear/editar).
 *   - Integración con React Query para obtener y mutar datos de forma eficiente.
 *   - Tabla interactiva con renderizado personalizado de campos y modo edición.
 *   - Interfaz responsiva y compatible con modo oscuro.
 *
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
import { useUsuarios } from "../../../hooks/useUsuario";
import { useProductoTallas } from "../../../hooks/useProductoTalla";
import Select from "react-select";
import { useForm } from "../LogicaAdmin/useForm";
import { CarritoCompraValidacion } from "../../../validation/CarritoCompraValidacion";
import { useCarritoComprasAdmin } from "./Logica/useCarritoCompraAdmin";
import { CarritoCompraInicial } from "../../../constants/carritoCompraConstantes";
import { carritoFormSchema } from "./Constans/carritoFormSchema";
import { tableRenderers } from "./Constans/tableRenderers";

const CarritoComprasPageAdmin = () => {
  // Formularios separados para creación y edición
  const nuevoCarritoCompraForm = useForm(
    CarritoCompraInicial,
    CarritoCompraValidacion
  );
  const editCarritoCompraForm = useForm(
    CarritoCompraInicial,
    CarritoCompraValidacion
  );
  // Hook que encapsula toda la lógica de negocio del módulo
  const {
    carritoCompras,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
  } = useCarritoComprasAdmin(nuevoCarritoCompraForm, editCarritoCompraForm);

  /** Opciones para selects: Usuarios y Carritos CompraTalla */
  const { data: usuarios = [] } = useUsuarios();
  const { data: productotallas = [] } = useProductoTallas();

  // Transformación de datos para react-select
  const usuarioOptions = usuarios.map((m) => ({
    value: m.usuarioId,
    label: m.nombreCompleto,
  }));

  const productoTallaOptions = productotallas.map((g) => ({
    value: g.productoTallaId,
    label: g.nombre,
  }));


  /* ================== Generar columnas dinámicas ================== */
  const columns = Object.keys(carritoFormSchema).map((key) => {
    const schema = carritoFormSchema[key];
    return {
      key,
      label: schema.label,
      className: schema.table?.className || "",
      render: (row) =>
        schema.table?.type
          ? tableRenderers[schema.table.type](row[key], row, {
              usuarios,
              productoTallas,
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
    const valido = await nuevoCarritoCompraForm.validate();
    if (!valido) return; // Si hay errores, no continua
    handleCrear();
  };

  return (
    <PageCrud activeTab="carritoCompras">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* ================= HEADER ================= */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Carrito Compra
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* ================= FORMULARIO ================= */}
          <aside className="w-full md:w-[300px] self-start sticky top-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nuevo Carrito Compra
            </h2>
            {/* Inputs dinámicos generados por la estructura del modelo */}
            <div className="space-y-3">
              {/* ===== cantidad ===== */}
              <div className="space-y-1">
                <label className="text-secondary text-xs font-medium">
                  Cantidad
                </label>
                <input
                  type="number"
                  value={nuevoCarritoCompraForm.values.imagen}
                  onChange={(e) =>
                    nuevoCarritoCompraForm.handleChange(
                      "cantidad",
                      e.target.value
                    )
                  }
                  placeholder="URL de la cantidad"
                  className={`w-full rounded-md px-3 py-2 border text-body bg-gray-50 dark:bg-gray-950 ${
                    nuevoCarritoCompraForm.errors.cantidad
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
                  } focus:outline-none focus:ring-2`}
                />
                {nuevoCarritoCompraForm.errors.cantidad && (
                  <span className="text-error text-xs">
                    {nuevoCarritoCompraForm.errors.cantidad}
                  </span>
                )}
              </div>

              {/* ===== Precio Unitario ===== */}
              <div className="space-y-1">
                <label className="text-secondary text-xs font-medium">
                  Precio Unitario
                </label>
                <input
                  type="number"
                  value={nuevoCarritoCompraForm.values.precioUnitario}
                  onChange={(e) =>
                    nuevoCarritoCompraForm.handleChange(
                      "precioUnitario",
                      e.target.value
                    )
                  }
                  className={`w-full rounded-md px-3 py-2 border text-body bg-gray-50 dark:bg-gray-950 ${
                    nuevoCarritoCompraForm.errors.precioUnitario
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500"
                  } focus:outline-none focus:ring-2`}
                />
                {nuevoCarritoCompraForm.errors.precioUnitario && (
                  <span className="text-error text-xs">
                    {nuevoCarritoCompraForm.errors.precioUnitario}
                  </span>
                )}
              </div>

              {/* ===== Producto Talla ===== */}
              <div className="space-y-1">
                <label className="text-secondary text-xs font-medium">
                  Producto Talla
                </label>
                <Select
                  options={productoTallaOptions}
                  value={
                    productoTallaOptions.find(
                      (o) =>
                        o.value ===
                        nuevoCarritoCompraForm.values.productoTallaId
                    ) || null
                  }
                  onChange={(selected) =>
                    nuevoCarritoCompraForm.handleChange(
                      "productoTallaId",
                      selected ? selected.value : 0
                    )
                  }

                />
                {nuevoCarritoCompraForm.errors.monedaId && (
                  <span className="text-error text-xs">
                    {nuevoCarritoCompraForm.errors.productoTallaId}
                  </span>
                )}
              </div>

              {/* Usuario */}
              <div className="space-y-1">
                <label className="text-secondary text-xs font-medium">
                  Usuario
                </label>
                <Select
                  options={usuarioOptions}
                  value={
                    usuarioOptions.find(
                      (o) => o.value === nuevoCarritoCompraForm.values.usuarioId
                    ) || null
                  }
                  onChange={(selected) =>
                    nuevoCarritoCompraForm.handleChange(
                      "usuarioId",
                      selected ? selected.value : 0
                    )
                  }
                />
                {nuevoCarritoCompraForm.errors.usuarioId && (
                  <span className="text-error text-xs">
                    {nuevoCarritoCompraForm.errors.usuarioId}
                  </span>
                )}
              </div>

              {/* ===== Estado ===== */}
              <div className="space-y-1">
                <label className="text-secondary text-xs font-medium">
                  Estado
                </label>
                <select
                  value={
                    nuevoCarritoCompraForm.values.estado ? "true" : "false"
                  }
                  onChange={(e) =>
                    nuevoCarritoCompraForm.handleChange(
                      "estado",
                      e.target.value === "true"
                    )
                  }
                  className="w-full rounded-md px-3 py-2 border text-body bg-gray-50 dark:bg-gray-950 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
                {nuevoCarritoCompraForm.errors.estado && (
                  <span className="text-error text-xs">
                    {nuevoCarritoCompraForm.errors.estado}
                  </span>
                )}
              </div>

              {/* ===== Botón Agregar ===== */}
              <div className="flex justify-end pt-2">
                <AddButton onClick={handleCrearConValidacion} label="Agregar" />
              </div>
            </div>
          </aside>

          {/* ================= TABLA ================= */}
          <section className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="heading-block">Carritos Compra</h2>
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando carritoCompras...
              </p>
            ) : (
              <DataTable
                data={carritoCompras}
                keyField="carritoId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editCarritoCompraForm.values}
                onEditChange={editCarritoCompraForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (r) => (
                    <div className="flex gap-2 justify-center">
                      <EditButton onClick={() => handleEditar(r)} />
                      <DeleteButton
                        onClick={() => handleEliminar(r.carritoId)}
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

export default CarritoComprasPageAdmin;
