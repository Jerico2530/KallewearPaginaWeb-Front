/**
 * Página de Administración de Monedas
 *
 * Propósito del componente:
 *   - Gestionar el CRUD de monedas dentro del panel administrativo.
 *   - Presentar una interfaz profesional con formulario y tabla editable.
 *
 * Funcionalidades clave del proyecto:
 *   - Formulario con validación para agregar nuevas monedas.
 *   - Edición directamente desde la tabla con control de estado.
 *   - Exportación de datos a Excel para descarga del usuario.
 *   - Integración total con React Query para flujo de datos optimizado.
 */
import React, { useState } from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ExcelButton
} from "../../../components/UI/LogicaButton";
import { useMonedasAdmin } from "./Logica/useMonedaAdmin";
import { MonedaInicial } from "../../../constants/monedaConstantes";
import { useForm } from "../LogicaAdmin/useForm";
import {MonedaValidacion} from "../../../validation/MonedaValidacion";

const MonedasPageAdmin = () => {
  // Formularios controlados para crear y editar anuncios
  const nuevoMonedaForm = useForm(MonedaInicial, MonedaValidacion);
  const editMonedaForm = useForm(MonedaInicial, MonedaValidacion);
  // Hook con toda la lógica de negocio del módulo
  const {
    monedas,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel
  } = useMonedasAdmin(nuevoMonedaForm, editMonedaForm);

  /**
   * Configuración de columnas del DataTable.
   * Cada columna define cómo mostrar y cómo editar los datos.
   */
  const columns = [
    { key: "codigo", label: "Código", editable: { type: "text" } },
    { key: "nombre", label: "Nombre", editable: { type: "text" } },
    { key: "simbolo", label: "Símbolo", editable: { type: "text" } },
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
  // Validación extra antes de crear un moneda
  const handleCrearConValidacion = async () => {
    const valido = await nuevoMonedaForm.validate();
    if (!valido) return; // Si hay errores, no continua
    handleCrear();
  };

  return (
    <PageCrud activeTab="moneda">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-2xl max-w-full mx-auto p-4 sm:p-6 space-y-6 border dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center border-b pb-4 dark:border-secondary text-gray-800 dark:text-gray-100">
          Administración de Monedas
        </h1>
        {/* Distribución principal: formulario + tabla */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-8 w-full justify-center">
          {/* Panel de creación */}
          <div className="w-full md:w-1/4 max-w-xs self-start h-fit bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg space-y-4 sm:space-y-5 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-3 text-gray-700 dark:text-gray-200">
              Agregar Moneda
            </h2>
            {/* Inputs dinámicos generados por la estructura del modelo */}
            <div className="flex flex-col gap-2 sm:gap-3">
              {Object.keys(MonedaInicial).map((key) =>
                key !== "estado" ? (
                  <div key={key} className="flex flex-col gap-1">
                    <input
                      type={ "text"}
                      placeholder={key}
                      value={nuevoMonedaForm.values[key]}
                      onChange={(e) =>
                        nuevoMonedaForm.handleChange(key, e.target.value)
                      }
                      className={`border rounded-lg w-full px-3 py-2 text-sm sm:text-base focus:ring-2 ${
                        nuevoMonedaForm.errors[key]
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } dark:bg-gray-700 dark:text-gray-100 transition`}
                    />

                    {/* 🟢 Mostrar error debajo del input */}
                    {nuevoMonedaForm.errors[key] && (
                      <span className="text-xs text-red-500 font-medium">
                        {nuevoMonedaForm.errors[key]}
                      </span>
                    )}
                  </div>
                ) : null
              )}
              {/* Selector de estado */}
              <select
                value={nuevoMonedaForm.values.estado ? "true" : "false"}
                onChange={(e) =>
                  nuevoMonedaForm.handleChange(
                    "estado",
                    e.target.value === "true"
                  )
                }
                className="border rounded-lg w-full px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 transition"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
              {/* Botón de creación con validación */}
              <div className="flex justify-end mt-2">
                {/* 🟢 Usar versión con validación */}
                <AddButton onClick={handleCrearConValidacion} label="Agregar" />
              </div>
            </div>
          </div>

          {/* Sección de tabla interactiva */}
          <div className="w-full md:w-3/4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-4 text-gray-700 dark:text-gray-200">
              Lista de Monedas
            </h2>
            {/* Control de carga inicial */}
            <div className="overflow-x-auto scrollbar-none">
              {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  Cargando...
                </p>
              ) : (
                <DataTable
                  data={monedas}
                  keyField="monedaId"
                  columns={columns}
                  editId={editandoId}
                  editData={editMonedaForm.values}
                  onEditChange={editMonedaForm.handleChange}
                  onSave={handleGuardar}
                  onCancel={handleCancelar}
                  extraHeader={<ExcelButton onClick={descargarExcel} />}
                  actions={{
                    render: (m) => (
                      <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                        <EditButton onClick={() => handleEditar(m)} />
                        <DeleteButton
                          onClick={() => handleEliminar(m.monedaId)}
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

export default MonedasPageAdmin;
