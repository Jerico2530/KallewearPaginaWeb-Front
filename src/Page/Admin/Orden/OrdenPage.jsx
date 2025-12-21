/**
 * Página de Administración de Órdenes
 * ------------------------------------------------------------------
 * Propósito del componente:
 *   - Gestionar el CRUD de órdenes (crear, listar, editar, eliminar) dentro del panel administrativo.
 *   - Ofrecer edición en línea y validación controlada de datos.
 *
 * Funcionalidades clave:
 *   - Manejo centralizado de estados del formulario (crear/editar).
 *   - Integración con React Query para obtener y mutar datos de forma eficiente.
 *   - Tabla interactiva con renderizado personalizado de campos y modo edición.
 *   - Exportación de órdenes a Excel.
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
import { useUsuarios } from "../../../hooks/useUsuario";
import { useSucursales } from "../../../hooks/useSucursal";
import { useDirecciones } from "../../../hooks/useDireccion";
import Select from "react-select";
import { useForm } from "../LogicaAdmin/useForm";
import { OrdenValidacion } from "../../../validation/OrdenValidacion";
import { useOrdenesAdmin } from "./Logica/useOrdenAdmin";
import { OrdenInicial } from "../../../constants/ordenConstantes";

const OrdenesPageAdmin = () => {
  const nuevoOrdeneForm = useForm(OrdenInicial, OrdenValidacion);
  const editOrdeneForm = useForm(OrdenInicial, OrdenValidacion);
  // Hook que encapsula toda la lógica de negocio del módulo
  const {
    ordenes,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useOrdenesAdmin(nuevoOrdeneForm, editOrdeneForm);

  /** Opciones para selects: Usuarios , Sucursales y Direccion */
  const { data: usuarios = [] } = useUsuarios();
  const { data: sucursales = [] } = useSucursales();
  const { data: direciones = [] } = useDirecciones();

  // Transformación de datos para react-select
  const usuarioOptions = usuarios.map((m) => ({
    value: m.usuarioId,
    label: m.nombreCompleto,
  }));

  const sucursalOptions = sucursales.map((g) => ({
    value: g.sucursalId,
    label: g.locales,
  }));

  const direccionOptions = direciones.map((a) => ({
    value: a.direccionId,
    label: `${a.distrito} (${a.provincia})`,
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
      key: "metodoEntrega",
      label: "metodoEntrega",
      editable: { type: "text" },
    },
    { key: "Total", label: "Total", editable: { type: "number" } },
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
      key: "sucursalId",
      label: "Sucursal",
      render: (r) => renderSelectValue(r.sucursalId, sucursalOptions),
      editable: {
        render: (data, onChange) => (
          <Select
            options={sucursalOptions}
            value={
              sucursalOptions.find((opt) => opt.value === data.sucursalId) ||
              null
            }
            onChange={(selected) =>
              onChange("sucursalId", selected ? selected.value : 0)
            }
            placeholder="Selecciona Sucursal"
          />
        ),
      },
    },

    {
      key: "direccionId",
      label: "Direccion",
      render: (r) => renderSelectValue(r.direccionId, direccionOptions),
      editable: {
        render: (data, onChange) => (
          <Select
            options={direccionOptions}
            value={
              direccionOptions.find((opt) => opt.value === data.direccionId) ||
              null
            }
            onChange={(selected) =>
              onChange("direccionId", selected ? selected.value : 0)
            }
            placeholder="Selecciona Direccion"
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
  // Validación antes de crear un nuevo orden
  const handleCrearConValidacion = async () => {
    const valido = await nuevoOrdeneForm.validate();
    if (!valido) return; // Si hay errores, no continua
    handleCrear();
  };

  return (
    <PageCrud activeTab="ordenes">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-2xl max-w-full mx-auto p-4 sm:p-6 space-y-6 border dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center border-b pb-4 dark:border-secondary text-gray-800 dark:text-gray-100">
          Administración de Ordenes
        </h1>
        {/* Distribución principal: formulario + tabla */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-8 w-full justify-center">
          {/* Panel de creación */}
          <div className="w-full md:w-1/4 max-w-xs self-start h-fit bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg space-y-4 sm:space-y-5 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-3 text-gray-700 dark:text-gray-200">
              Agregar Ordene
            </h2>
            {/* Inputs dinámicos generados por la estructura del modelo */}
            <div className="flex flex-col gap-2 sm:gap-3">
              {Object.keys(OrdenInicial).map((key) =>
                key !== "estado" &&
                key !== "usuarioId" &&
                key !== "sucursalId" &&
                key !== "direccionId" ? (
                  <div key={key}>
                    <input
                      type={
                        key.toLowerCase().includes("Total") ? "number" : "text"
                      }
                      min={key.toLowerCase().includes("Total") ? 0 : undefined}
                      placeholder={key}
                      value={nuevoOrdeneForm.values[key] || ""}
                      onChange={(e) =>
                        nuevoOrdeneForm.handleChange(key, e.target.value)
                      }
                      className={`border rounded-lg w-full px-3 py-2 focus:ring-2 ${
                        nuevoOrdeneForm.errors[key]
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } dark:bg-gray-700 dark:text-gray-100`}
                    />
                    {nuevoOrdeneForm.errors[key] && (
                      <span className="text-xs text-red-500">
                        {nuevoOrdeneForm.errors[key]}
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
                    (opt) => opt.value === nuevoOrdeneForm.values.usuarioId
                  ) || null
                }
                onChange={(selected) =>
                  nuevoOrdeneForm.handleChange(
                    "usuarioId",
                    selected ? selected.value : 0
                  )
                }
                placeholder="Usuario"
              />
              {/* Select sucursal */}
              <Select
                options={sucursalOptions}
                value={
                  sucursalOptions.find(
                    (opt) => opt.value === nuevoOrdeneForm.values.sucursalId
                  ) || null
                }
                onChange={(selected) =>
                  nuevoOrdeneForm.handleChange(
                    "sucursalId",
                    selected ? selected.value : 0
                  )
                }
                placeholder="Sucursal"
              />
               {/* Select direccion */}
              <Select
                options={direccionOptions}
                value={
                  direccionOptions.find(
                    (opt) => opt.value === direccionOptions.values.direccionId
                  ) || null
                }
                onChange={(selected) =>
                  nuevoOrdeneForm.handleChange(
                    "direccionId",
                    selected ? selected.value : 0
                  )
                }
                placeholder="Direccion"
              />
              {/* Select estado */}
              <select
                value={nuevoOrdeneForm.values.estado ? "true" : "false"}
                onChange={(e) =>
                  nuevoOrdeneForm.handleChange(
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
              Lista de Ordenes
            </h2>
            {/* Control de carga inicial */}
            <div className="overflow-x-auto scrollbar-none">
              {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  Cargando...
                </p>
              ) : (
                <DataTable
                  data={ordenes}
                  keyField="ordenId"
                  columns={columns}
                  editId={editandoId}
                  editData={editOrdeneForm.values}
                  onEditChange={editOrdeneForm.handleChange}
                  onSave={handleGuardar}
                  onCancel={handleCancelar}
                  extraHeader={<ExcelButton onClick={descargarExcel} />}
                  actions={{
                    render: (r) => (
                      <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                        <EditButton onClick={() => handleEditar(r)} />
                        <DeleteButton
                          onClick={() => handleEliminar(r.ordenId)}
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

export default OrdenesPageAdmin;
