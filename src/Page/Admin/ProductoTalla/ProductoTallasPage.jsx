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
  ExcelButton,
} from "../../../components/UI/LogicaButton";

import { useProductos } from "../../../hooks/useProducto";
import { useTallas } from "../../../hooks/useTalla";
import Select from "react-select";
import { useForm } from "../LogicaAdmin/useForm";
import { ProductoTallaValidacion } from "../../../validation/ProductoTallaValidacion";
import { useProductoTallasAdmin } from "./Logica/useProductoTallaAdmin";
import { ProductoTallaInicial } from "../../../constants/productoTallaConstantes";

const ProductoTallasPageAdmin = () => {
  // Formularios separados para creación y edición
  const nuevoProductoTallaForm = useForm(
    ProductoTallaInicial,
    ProductoTallaValidacion
  );
  const editProductoTallaForm = useForm(
    ProductoTallaInicial,
    ProductoTallaValidacion
  );
  // Hook que encapsula toda la lógica de negocio del módulo
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

  /** Opciones para selects: Producto y Talla */
  const { data: productos = [] } = useProductos();
  const { data: tallas = [] } = useTallas();
  // Transformación de datos para react-select
  const productoOptions = productos.map((m) => ({
    value: m.productoId,
    label: m.nombre,
  }));

  const tallaOptions = tallas.map((g) => ({
    value: g.tallaId,
    label: g.tipoTalla,
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
      key: "imagen",
      label: "Producto",
      render: (r) => (
        <img
          src={r.imagen}
          alt={r.nombre}
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripcion" },
    { key: "precio", label: "Precio" },
    { key: "talla", label: "Talla", render: (r) => r.tipoTalla },
    { key: "categoria", label: "Categoria", render: (r) => r.categoria },
    { key: "moneda", label: "Moneda", render: (r) => r.moneda },
    { key: "genero", label: "Genero", render: (r) => r.genero },
    { key: "stock", label: "Stock", editable: { type: "number" } },
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
    const valido = await nuevoProductoTallaForm.validate();
    if (!valido) return; // Si hay errores, no continua
    handleCrear();
  };

  return (
    <PageCrud activeTab="productoTalla">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-2xl max-w-full mx-auto p-4 sm:p-6 space-y-6 border dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center border-b pb-4 dark:border-secondary text-gray-800 dark:text-gray-100">
          Administración de Producto-Talla
        </h1>
        {/* Distribución principal: formulario + tabla */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-8 w-full justify-center">
          {/* Panel de creación */}
          <div className="w-full md:w-1/4 max-w-xs self-start h-fit bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg space-y-4 sm:space-y-5 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-3 text-gray-700 dark:text-gray-200">
              Agregar Producto-Talla
            </h2>
            {/* Inputs dinámicos generados por la estructura del modelo */}
            <div className="flex flex-col gap-2 sm:gap-3">
              {Object.keys(ProductoTallaInicial).map((key) =>
                key !== "estado" &&
                key !== "productoId" &&
                key !== "tallaId" &&
                key !== "productoCategoriaId" ? (
                  <div key={key}>
                    <input
                      type={
                        key.toLowerCase().includes("stock") ? "number" : "text"
                      }
                      min={key.toLowerCase().includes("stock") ? 0 : undefined}
                      placeholder={key}
                      value={nuevoProductoTallaForm.values[key] || ""}
                      onChange={(e) =>
                        nuevoProductoTallaForm.handleChange(key, e.target.value)
                      }
                      className={`border rounded-lg w-full px-3 py-2 focus:ring-2 ${
                        nuevoProductoTallaForm.errors[key]
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } dark:bg-gray-700 dark:text-gray-100`}
                    />
                    {nuevoProductoTallaForm.errors[key] && (
                      <span className="text-xs text-red-500">
                        {nuevoProductoTallaForm.errors[key]}
                      </span>
                    )}
                  </div>
                ) : null
              )}

              <Select
                options={tallaOptions}
                value={
                  tallaOptions.find(
                    (opt) =>
                      opt.value === nuevoProductoTallaForm.values.tallaIdId
                  ) || null
                }
                onChange={(selected) =>
                  nuevoProductoTallaForm.handleChange(
                    "tallaId",
                    selected ? selected.value : 0
                  )
                }
                placeholder="Talla"
              />

              <Select
                options={productoOptions}
                value={
                  productoOptions.find(
                    (opt) =>
                      opt.value === nuevoProductoTallaForm.values.productoId
                  ) || null
                }
                onChange={(selected) =>
                  nuevoProductoTallaForm.handleChange(
                    "productoId",
                    selected ? selected.value : 0
                  )
                }
                placeholder="Producto"
              />
              <select
                value={nuevoProductoTallaForm.values.estado ? "true" : "false"}
                onChange={(e) =>
                  nuevoProductoTallaForm.handleChange(
                    "estado",
                    e.target.value === "true"
                  )
                }
                className="border rounded-lg w-full px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 transition"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>

              <div className="flex justify-end mt-2">
                {/* 🟢 Usar versión con validación */}
                <AddButton onClick={handleCrearConValidacion} label="Agregar" />
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="w-full md:w-3/4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-4 text-gray-700 dark:text-gray-200">
              Lista de Producto-Talla
            </h2>

            <div className="overflow-x-auto scrollbar-none">
              {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  Cargando...
                </p>
              ) : (
                <DataTable
                  data={productoTallas}
                  keyField="productoTallaId"
                  columns={columns}
                  editId={editandoId}
                  editData={editProductoTallaForm.values}
                  onEditChange={editProductoTallaForm.handleChange}
                  onSave={handleGuardar}
                  onCancel={handleCancelar}
                  extraHeader={<ExcelButton onClick={descargarExcel} />}
                  actions={{
                    render: (r) => (
                      <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
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
            </div>
          </div>
        </div>
      </div>
    </PageCrud>
  );
};

export default ProductoTallasPageAdmin;
