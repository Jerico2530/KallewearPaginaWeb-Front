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

  /**
   * Configuración de columnas de la DataTable
   * Define visualización, edición y traducción de datos
   */
  const columns = [
    {
      key: "PrecioUnitario",
      label: "PrecioUnitario",
      editable: { type: "number" },
    },
    { key: "Cantidad", label: "Cantidad", editable: { type: "number" } },
    {
      key: "ordeneId",
      label: "Ordene",
      render: (r) => renderSelectValue(r.ordeneId, ordeneOptions),
      editable: {
        render: (data, onChange) => (
          <Select
            options={ordeneOptions}
            value={
              ordeneOptions.find((opt) => opt.value === data.ordeneId) || null
            }
            onChange={(selected) =>
              onChange("ordeneId", selected ? selected.value : 0)
            }
            placeholder="Selecciona ordene"
          />
        ),
      },
    },
    {
      key: "productoId",
      label: "Género",
      render: (r) => renderSelectValue(r.productoId, productoOptions),
      editable: {
        render: (data, onChange) => (
          <Select
            options={productoOptions}
            value={
              productoOptions.find((opt) => opt.value === data.productoId) ||
              null
            }
            onChange={(selected) =>
              onChange("productoId", selected ? selected.value : 0)
            }
            placeholder="Selecciona género"
          />
        ),
      },
    },

    {
      key: "fechaRegistro",
      label: "Fecha Registro",
      render: (r) =>
        r.fechaRegistro ? new Date(r.fechaRegistro).toLocaleDateString() : "-",
    },
    {
      key: "estado",
      label: "Estado",
      render: (r) => (
        <span
          className={`font-semibold ${
            r.estado
              ? "text-green-700 dark:text-green-400"
              : "text-red-700 dark:text-red-400"
          }`}
        >
          {r.estado ? "Activo" : "Inactivo"}
        </span>
      ),
      // Permite cambiar el estado desde la tabla
      editable: {
        render: (data, onChange) => (
          <select
            value={data.estado ? "true" : "false"}
            onChange={(e) => onChange("estado", e.target.value === "true")}
            className="border rounded px-1 py-1 w-full dark:bg-gray-700 dark:text-white text-black"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        ),
      },
    },
  ];

  // Validación antes de crear un nuevo registro
  const handleCrearConValidacion = async () => {
    const valido = await nuevoOrdenDetalleForm.validate();
    if (!valido) return; // Si hay errores, no continua
    handleCrear();
  };

  return (
    <PageCrud activeTab="ordenDetalles">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-2xl max-w-full mx-auto p-4 sm:p-6 space-y-6 border dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center border-b pb-4 dark:border-secondary text-gray-800 dark:text-gray-100">
          Administración de OrdenDetalles
        </h1>
        {/* Distribución principal: formulario + tabla */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-8 w-full justify-center">
          {/* Panel de creación */}
          <div className="w-full md:w-1/4 max-w-xs self-start h-fit bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg space-y-4 sm:space-y-5 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-3 text-gray-700 dark:text-gray-200">
              Agregar OrdenDetalle
            </h2>
            {/* Inputs dinámicos generados por la estructura del modelo */}
            <div className="flex flex-col gap-2 sm:gap-3">
              {Object.keys(OrdenDetalleInicial).map((key) =>
                key !== "estado" &&
                key !== "ordeneId" &&
                key !== "productoId" ? (
                  <div key={key}>
                    <input
                      type={
                        key.toLowerCase().includes("PrecioUnitario")
                          ? "number"
                          : "text"
                      }
                      min={
                        key.toLowerCase().includes("PrecioUnitario")
                          ? 0
                          : undefined
                      }
                      placeholder={key}
                      value={nuevoOrdenDetalleForm.values[key] || ""}
                      onChange={(e) =>
                        nuevoOrdenDetalleForm.handleChange(key, e.target.value)
                      }
                      className={`border rounded-lg w-full px-3 py-2 focus:ring-2 ${
                        nuevoOrdenDetalleForm.errors[key]
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } dark:bg-gray-700 dark:text-gray-100`}
                    />
                    <input
                      type={
                        key.toLowerCase().includes("Cantidad")
                          ? "number"
                          : "text"
                      }
                      min={
                        key.toLowerCase().includes("Cantidad") ? 0 : undefined
                      }
                      placeholder={key}
                      value={nuevoOrdenDetalleForm.values[key] || ""}
                      onChange={(e) =>
                        nuevoOrdenDetalleForm.handleChange(key, e.target.value)
                      }
                      className={`border rounded-lg w-full px-3 py-2 focus:ring-2 ${
                        nuevoOrdenDetalleForm.errors[key]
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } dark:bg-gray-700 dark:text-gray-100`}
                    />

                    {nuevoOrdenDetalleForm.errors[key] && (
                      <span className="text-xs text-red-500">
                        {nuevoOrdenDetalleForm.errors[key]}
                      </span>
                    )}
                  </div>
                ) : null
              )}
              {/* Select Orden */}
              <Select
                options={ordeneOptions}
                value={
                  ordeneOptions.find(
                    (opt) => opt.value === nuevoOrdenDetalleForm.values.ordeneId
                  ) || null
                }
                onChange={(selected) =>
                  nuevoOrdenDetalleForm.handleChange(
                    "ordeneId",
                    selected ? selected.value : 0
                  )
                }
                placeholder="Ordene"
              />

              {/* Select Producto */}
              <Select
                options={productoOptions}
                value={
                  productoOptions.find(
                    (opt) =>
                      opt.value === nuevoOrdenDetalleForm.values.productoId
                  ) || null
                }
                onChange={(selected) =>
                  nuevoOrdenDetalleForm.handleChange(
                    "productoId",
                    selected ? selected.value : 0
                  )
                }
                placeholder="Producto"
              />
              {/* Select estado */}
              <select
                value={nuevoOrdenDetalleForm.values.estado ? "true" : "false"}
                onChange={(e) =>
                  nuevoOrdenDetalleForm.handleChange(
                    "estado",
                    e.target.value === "true"
                  )
                }
                className="border rounded-lg w-full px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 transition"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
              {/* Botón crear con validación */}
              <div className="flex justify-end mt-2">
                {/* 🟢 Usar versión con validación */}
                <AddButton onClick={handleCrearConValidacion} label="Agregar" />
              </div>
            </div>
          </div>

          {/* Sección de tabla interactiva */}
          <div className="w-full md:w-3/4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-4 text-gray-700 dark:text-gray-200">
              Lista de OrdenDetalles
            </h2>
            {/* Control de carga inicial */}
            <div className="overflow-x-auto scrollbar-none">
              {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  Cargando...
                </p>
              ) : (
                <DataTable
                  data={ordenDetalles}
                  keyField="ordenDetalleId"
                  columns={columns}
                  editId={editandoId}
                  editData={editOrdenDetalleForm.values}
                  onEditChange={editOrdenDetalleForm.handleChange}
                  onSave={handleGuardar}
                  onCancel={handleCancelar}
                  actions={{
                    render: (r) => (
                      <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                        <EditButton onClick={() => handleEditar(r)} />
                        <DeleteButton
                          onClick={() => handleEliminar(r.ordenDetalleId)}
                        />
                      </div>
                    ),
                    saveIcon: <SaveButton onClick={handleGuardar} />,
                    cancelIcon: <CancelButton onClick={handleCancelar} />,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageCrud>
  );
};

export default OrdenDetallesPageAdmin;
