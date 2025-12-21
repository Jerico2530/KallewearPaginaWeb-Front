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

  /** Opciones para selects: Usuarios y ProductosTalla */
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
    { key: "cantidad", label: "cantidad", editable: { type: "number" } },
    {
      key: "precioUnitario",
      label: "precioUnitario",
      editable: { type: "number" },
    },
    {
      key: "usuarioId",
      label: "Usuario",
      render: (r) => renderSelectValue(r.usuarioId, usuarioOptions),
      editable: {
        render: (data, onChange) => (
          <Select
            options={usuarioOptions}
            value={
              usuarioOptions.find((opt) => opt.value === data.usuarioId) || null
            }
            onChange={(selected) =>
              onChange("usuarioId", selected ? selected.value : 0)
            }
            placeholder="Selecciona usuario"
          />
        ),
      },
    },
    {
      key: "productoTallaId",
      label: "ProductoTalla",
      render: (r) => renderSelectValue(r.productoTallaId, productoTallaOptions),
      editable: {
        render: (data, onChange) => (
          <Select
            options={productoTallaOptions}
            value={
              productoTallaOptions.find(
                (opt) => opt.value === data.productoTallaId
              ) || null
            }
            onChange={(selected) =>
              onChange("productoTallaId", selected ? selected.value : 0)
            }
            placeholder="Selecciona Producto Talla"
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
    const valido = await nuevoCarritoCompraForm.validate();
    if (!valido) return; // Si hay errores, no continua
    handleCrear();
  };

  return (
    <PageCrud activeTab="carritoCompras">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-2xl max-w-full mx-auto p-4 sm:p-6 space-y-6 border dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center border-b pb-4 dark:border-secondary text-gray-800 dark:text-gray-100">
          Administración de CarritoCompras
        </h1>
        {/* Distribución principal: formulario + tabla */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-8 w-full justify-center">
          {/* Panel de creación */}
          <div className="w-full md:w-1/4 max-w-xs self-start h-fit bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg space-y-4 sm:space-y-5 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-3 text-gray-700 dark:text-gray-200">
              Agregar CarritoCompra
            </h2>
            {/* Inputs dinámicos generados por la estructura del modelo */}
            <div className="flex flex-col gap-2 sm:gap-3">
              {Object.keys(CarritoCompraInicial).map((key) =>
                key !== "estado" &&
                key !== "usuarioId" &&
                key !== "productoTallaId" ? (
                  <div key={key}>
                    <input
                      type="number"
                      min={0}
                      placeholder={key}
                      value={nuevoCarritoCompraForm.values[key] || ""}
                      onChange={(e) =>
                        nuevoCarritoCompraForm.handleChange(
                          key,
                          Number(e.target.value)
                        )
                      }
                      className={`border rounded-lg w-full px-3 py-2 focus:ring-2 ${
                        nuevoCarritoCompraForm.errors[key]
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } dark:bg-gray-700 dark:text-gray-100`}
                    />
                    {/* 🟢 Mostrar error debajo del input */}
                    {nuevoCarritoCompraForm.errors[key] && (
                      <span className="text-xs text-red-500">
                        {nuevoCarritoCompraForm.errors[key]}
                      </span>
                    )}
                  </div>
                ) : null
              )}

              {/* Select usuario */}
              <Select
                options={usuarioOptions}
                value={
                  usuarioOptions.find(
                    (opt) =>
                      opt.value === nuevoCarritoCompraForm.values.usuarioId
                  ) || null
                }
                onChange={(selected) =>
                  nuevoCarritoCompraForm.handleChange(
                    "usuarioId",
                    selected ? selected.value : 0
                  )
                }
                placeholder="Moneda"
              />

              {/* Select producto talla */}
              <Select
                options={productoTallaOptions}
                value={
                  productoTallaOptions.find(
                    (opt) =>
                      opt.value ===
                      nuevoCarritoCompraForm.values.productoTallaId
                  ) || null
                }
                onChange={(selected) =>
                  nuevoCarritoCompraForm.handleChange(
                    "productoTallaId",
                    selected ? selected.value : 0
                  )
                }
                placeholder="ProductoTalla"
              />

              {/* Select estado */}
              <select
                value={nuevoCarritoCompraForm.values.estado ? "true" : "false"}
                onChange={(e) =>
                  nuevoCarritoCompraForm.handleChange(
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
              Lista de CarritoCompras
            </h2>
            {/* Control de carga inicial */}
            <div className="overflow-x-auto scrollbar-none">
              {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  Cargando...
                </p>
              ) : (
                <DataTable
                  data={carritoCompras}
                  keyField="carritoId"
                  columns={columns}
                  editId={editandoId}
                  editData={editCarritoCompraForm.values}
                  onEditChange={editCarritoCompraForm.handleChange}
                  onSave={handleGuardar}
                  onCancel={handleCancelar}
                  actions={{
                    render: (r) => (
                      <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
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
            </div>
          </div>
        </div>
      </div>
    </PageCrud>
  );
};

export default CarritoComprasPageAdmin;
