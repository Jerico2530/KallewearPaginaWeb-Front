/**
 * Página de Administración de Historias
 *
 * Propósito del componente:
 *   - Gestionar el CRUD de Historias (crear, listar, editar, eliminar) desde el panel administrativo.
 *   - Proveer una interfaz clara con formulario y tabla editable.
 *
 * Funcionalidades clave del proyecto:
 *   - Manejo de estados de creación y edición con validación de formularios.
 *   - Tabla interactiva con edición en línea y exportación a Excel.
 *   - Integración con React Query para un flujo de datos óptimo.
 *   - Diseño adaptable (responsive) con soporte para modo oscuro.
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
  ExcelButton,
} from "../../../components/UI/LogicaButton";
import { useHistoriasAdmin } from "./Logica/useHistoriaAdmin";
import { HistoriaInicial } from "../../../constants/historiaConstantes";
import { useForm } from "../LogicaAdmin/useForm";
import { HistoriaValidacion } from "../../../validation/HistoriaValidacion";
const HistoriasPageAdmin = () => {
  // Formularios controlados para crear y editar anuncios
  const nuevoHistoriaForm = useForm(HistoriaInicial, HistoriaValidacion);
  const editHistoriaForm = useForm(HistoriaInicial, HistoriaValidacion);
  // Hook con toda la lógica de negocio del módulo
  const {
    historias,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useHistoriasAdmin(nuevoHistoriaForm, editHistoriaForm);

  /**
   * Configuración de columnas del DataTable.
   * Cada columna define cómo mostrar y cómo editar los datos.
   */
  const columns = [
    {
      key: "año",
      label: "Año",
      render: (r) =>
        r.año ? new Date(r.año).toLocaleDateString("es-ES") : "-",
      editable: { type: "date" },
    },
    { key: "titulo", label: "Título", editable: { type: "text" } },
    {
      key: "descripcion",
      label: "Descripción",
      editable: { type: "textarea" },
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
  // Validación extra antes de crear un historia
  const handleCrearConValidacion = async () => {
    const valido = await nuevoHistoriaForm.validate();
    if (!valido) return; // Si hay errores, no continua
    handleCrear();
  };

  return (
    <PageCrud activeTab="historia">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-2xl max-w-full mx-auto p-4 sm:p-6 space-y-6 border dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center border-b pb-4 dark:border-secondary text-gray-800 dark:text-gray-100">
          Administración de Historias
        </h1>
        
        {/* Distribución principal: formulario + tabla */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-8 w-full justify-center">
          {/* Panel de creación */}
          <div className="w-full md:w-1/4 max-w-xs self-start h-fit bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg space-y-4 sm:space-y-5 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-3 text-gray-700 dark:text-gray-200">
              Agregar Historia
            </h2>
            <div className="flex flex-col gap-2 sm:gap-3">
              {/* Inputs dinámicos generados por la estructura del modelo */}
              {Object.keys(HistoriaInicial).map((key) =>
                key !== "estado" ? (
                  <div key={key} className="flex flex-col gap-1">
                    <input
                      type={
                        ["contraseña", "contraseñaVisible"].includes(key)
                          ? "password"
                          : key.toLowerCase().includes("año")
                          ? "date"
                          : "text"
                      }
                      placeholder={key}
                      value={nuevoHistoriaForm.values[key]}
                      onChange={(e) =>
                        nuevoHistoriaForm.handleChange(key, e.target.value)
                      }
                      className={`border rounded-lg w-full px-3 py-2 text-sm sm:text-base focus:ring-2 ${
                        nuevoHistoriaForm.errors[key]
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } dark:bg-gray-700 dark:text-gray-100 transition`}
                    />

                    {/* 🟢 Mostrar error debajo del input */}
                    {nuevoHistoriaForm.errors[key] && (
                      <span className="text-xs text-red-500 font-medium">
                        {nuevoHistoriaForm.errors[key]}
                      </span>
                    )}
                  </div>
                ) : null
              )}
              {/* Selector de estado */}
              <select
                value={nuevoHistoriaForm.values.estado ? "true" : "false"}
                onChange={(e) =>
                  nuevoHistoriaForm.handleChange(
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
              Lista de Historias
            </h2>
            {/* Control de carga inicial */}
            <div className="overflow-x-auto scrollbar-none">
              {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  Cargando...
                </p>
              ) : (
                <DataTable
                  data={historias}
                  keyField="historiaId"
                  columns={columns}
                  editId={editandoId}
                  editData={editHistoriaForm.values}
                  onEditChange={editHistoriaForm.handleChange}
                  onSave={handleGuardar}
                  onCancel={handleCancelar}
                  extraHeader={<ExcelButton onClick={descargarExcel} />}
                  actions={{
                    render: (h) => (
                      <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                        <EditButton onClick={() => handleEditar(h)} />
                        <DeleteButton
                          onClick={() => handleEliminar(h.historiaId)}
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

export default HistoriasPageAdmin;
