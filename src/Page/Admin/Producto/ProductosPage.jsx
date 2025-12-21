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
import { useMonedas } from "../../../hooks/useMoneda";
import { useGeneros } from "../../../hooks/useGenero";
import Select from "react-select";
import { useForm } from "../LogicaAdmin/useForm";
import { ProductoValidacion } from "../../../validation/ProductoValidacion";
import { useProductosAdmin } from "./Logica/useProductoAdmin";
import { ProductoInicial } from "../../../constants/productoConstantes";

const ProductosPageAdmin = () => {
  // Formularios separados para creación y edición
  const nuevoProductoForm = useForm(ProductoInicial, ProductoValidacion);
  const editProductoForm = useForm(ProductoInicial, ProductoValidacion);

  // Hook que encapsula toda la lógica de negocio de productos
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

  /** Opciones desde hooks relacionados: monedas y géneros */
  const { data: monedas = [] } = useMonedas();
  const { data: generos = [] } = useGeneros();
  // Transformación de datos para react-select
  const monedaOptions = monedas.map((m) => ({
    value: m.monedaId,
    label: `${m.nombre} (${m.codigo})`,
  }));

  const generoOptions = generos.map((g) => ({
    value: g.generoId,
    label: g.tipo,
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
      label: "Imagen",
      render: (u) => (
        <img
          src={u.imagen}
          alt="img"
          className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
        />
      ),
      editable: {
        render: (data, onChange) => (
          <input
            type="text"
            placeholder="URL de la imagen"
            value={data.imagen || ""}
            onChange={(e) => onChange("imagen", e.target.value)}
            className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 transition text-xs sm:text-sm"
          />
        ),
      },
    },
    { key: "nombre", label: "Nombre", editable: { type: "text" } },
    { key: "descripcion", label: "Descripción", editable: { type: "text" } },
    { key: "precio", label: "Precio", editable: { type: "number" } },
    {
      key: "monedaId",
      label: "Moneda",
      render: (r) => renderSelectValue(r.monedaId, monedaOptions),
      editable: {
        render: (data, onChange) => (
          <Select
            options={monedaOptions}
            value={
              monedaOptions.find((opt) => opt.value === data.monedaId) || null
            }
            onChange={(selected) =>
              onChange("monedaId", selected ? selected.value : 0)
            }
            placeholder="Selecciona moneda"
          />
        ),
      },
    },
    {
      key: "generoId",
      label: "Género",
      render: (r) => renderSelectValue(r.generoId, generoOptions),
      editable: {
        render: (data, onChange) => (
          <Select
            options={generoOptions}
            value={
              generoOptions.find((opt) => opt.value === data.generoId) || null
            }
            onChange={(selected) =>
              onChange("generoId", selected ? selected.value : 0)
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
    const valido = await nuevoProductoForm.validate();
    if (!valido) return; // Si hay errores, no continua
    handleCrear();
  };

  return (
    <PageCrud activeTab="productos">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-2xl max-w-full mx-auto p-4 sm:p-6 space-y-6 border dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center border-b pb-4 dark:border-secondary text-gray-800 dark:text-gray-100">
          Administración de Productos
        </h1>
        {/* Distribución principal: formulario + tabla */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-8 w-full justify-center">
          {/* Panel de creación */}
          <div className="w-full md:w-1/4 max-w-xs self-start h-fit bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg space-y-4 sm:space-y-5 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-3 text-gray-700 dark:text-gray-200">
              Agregar Producto
            </h2>
            {/* Inputs dinámicos generados por la estructura del modelo */}
            <div className="flex flex-col gap-2 sm:gap-3">
              {Object.keys(ProductoInicial).map((key) =>
                key !== "estado" && key !== "monedaId" && key !== "generoId" ? (
                  <div key={key}>
                    <input
                      type={
                        key.toLowerCase().includes("precio") ? "number" : "text"
                      }
                      min={key.toLowerCase().includes("precio") ? 0 : undefined}
                      placeholder={key}
                      value={nuevoProductoForm.values[key] || ""}
                      onChange={(e) =>
                        nuevoProductoForm.handleChange(key, e.target.value)
                      }
                      className={`border rounded-lg w-full px-3 py-2 focus:ring-2 ${
                        nuevoProductoForm.errors[key]
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } dark:bg-gray-700 dark:text-gray-100`}
                    />
                    {/* 🟢 Mostrar error debajo del input */}
                    {nuevoProductoForm.errors[key] && (
                      <span className="text-xs text-red-500">
                        {nuevoProductoForm.errors[key]}
                      </span>
                    )}
                  </div>
                ) : null
              )}
              {/* Select moneda */}
              <Select
                options={monedaOptions}
                value={
                  monedaOptions.find(
                    (opt) => opt.value === nuevoProductoForm.values.monedaId
                  ) || null
                }
                onChange={(selected) =>
                  nuevoProductoForm.handleChange(
                    "monedaId",
                    selected ? selected.value : 0
                  )
                }
                placeholder="Moneda"
              />

              {/* Select genero */}
              <Select
                options={generoOptions}
                value={
                  generoOptions.find(
                    (opt) => opt.value === nuevoProductoForm.values.generoId
                  ) || null
                }
                onChange={(selected) =>
                  nuevoProductoForm.handleChange(
                    "generoId",
                    selected ? selected.value : 0
                  )
                }
                placeholder="Género"
              />
              {/* Select estado */}
              <select
                value={nuevoProductoForm.values.estado ? "true" : "false"}
                onChange={(e) =>
                  nuevoProductoForm.handleChange(
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
              Lista de Productos
            </h2>
            {/* Control de carga inicial */}
            <div className="overflow-x-auto scrollbar-none">
              {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  Cargando...
                </p>
              ) : (
                <DataTable
                  data={productos}
                  keyField="productoId"
                  columns={columns}
                  editId={editandoId}
                  editData={editProductoForm.values}
                  onEditChange={editProductoForm.handleChange}
                  onSave={handleGuardar}
                  onCancel={handleCancelar}
                  extraHeader={<ExcelButton onClick={descargarExcel} />}
                  actions={{
                    render: (r) => (
                      <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
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
            </div>
          </div>
        </div>
      </div>
    </PageCrud>
  );
};

export default ProductosPageAdmin;
