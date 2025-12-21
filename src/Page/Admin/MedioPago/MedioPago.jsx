/**
 * Página de Administración de Medio Pago
 *
 * Propósito del componente:
 *   - Gestionar operaciones CRUD del catálogo de Medios de Pago desde el panel administrativo.
 *   - Permitir edición en línea y validación del formulario antes de crear registros.
 *
 * Funcionalidades clave del proyecto:
 *   - Manejo independiente de estados de formularios para creación y edición.
 *   - Integración con librerías de estado remoto y hooks personalizados.
 *   - Tabla editable con renderizado dinámico de campos y acciones configurables.
 *   - UI responsiva, con soporte para modo oscuro y mejora de accesibilidad.
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
import { useForm } from "../LogicaAdmin/useForm";
import { MedioPagoValidacion } from "../../../validation/medioPagoValidacion";
import { useMedioPagosAdmin } from "./Logica/useMedioPagoAdmin";
import { MedioPagoInicial } from "../../../constants/medioPagoConstantes";
import Select from "react-select";
import { useTipoPagos } from "../../../hooks/useTipoPago";

const MedioPagoPageAdmin = () => {
  // Formularios separados para creación y edición
  const nuevoMedioPagoForm = useForm(MedioPagoInicial, MedioPagoValidacion);
  const editMedioPagoForm = useForm(MedioPagoInicial, MedioPagoValidacion);
  // Hook que encapsula toda la lógica de negocio del módulo
  const {
    medioPagos,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useMedioPagosAdmin(nuevoMedioPagoForm, editMedioPagoForm);

  /** Opciones para selects: Tipo Pago */
  const { data: tipoPagos = [] } = useTipoPagos();
  
  // Transformación de datos para react-select
  const tipoPagoOptions = tipoPagos.map((m) => ({
    value: m.tipoPagoId,
    label: m.descripcionTipoPago,
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
      key: "descripcionMedioPago",
      label: "descripcionMedioPago",
      editable: { type: "text" },
    },
    {
      key: "medioPago",
      label: "medioPago",
      render: (r) => `${r.descripcionMedioPago} `,
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
    const valido = await nuevoMedioPagoForm.validate();
    if (!valido) return; // Si hay errores, no continua
    handleCrear();
  };

  return (
    <PageCrud activeTab="medioPago">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-2xl max-w-full mx-auto p-4 sm:p-6 space-y-6 border dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center border-b pb-4 dark:border-secondary text-gray-800 dark:text-gray-100">
          Administración de MedioPago
        </h1>
        {/* Distribución principal: formulario + tabla */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-8 w-full justify-center">
          {/* Panel de creación */}
          <div className="w-full md:w-1/4 max-w-xs self-start h-fit bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg space-y-4 sm:space-y-5 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-3 text-gray-700 dark:text-gray-200">
              Agregar MedioPago
            </h2>
            {/* Inputs dinámicos generados por la estructura del modelo */}
            <div className="flex flex-col gap-2 sm:gap-3">
              {Object.keys(MedioPagoInicial).map((key) =>
                key !== "estado" && key !== "tipoPagoId" ? (
                  <div key={key} className="flex flex-col gap-1">
                    <input
                      type={"text"}
                      placeholder={key}
                      value={nuevoMedioPagoForm.values[key]}
                      onChange={(e) =>
                        nuevoMedioPagoForm.handleChange(key, e.target.value)
                      }
                      className={`border rounded-lg w-full px-3 py-2 text-sm sm:text-base focus:ring-2 ${
                        nuevoMedioPagoForm.errors[key]
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } dark:bg-gray-700 dark:text-gray-100 transition`}
                    />

                    {/* 🟢 Mostrar error debajo del input */}
                    {nuevoMedioPagoForm.errors[key] && (
                      <span className="text-xs text-red-500 font-medium">
                        {nuevoMedioPagoForm.errors[key]}
                      </span>
                    )}
                  </div>
                ) : null
              )}
              {/* Select Tipo Pago */}
              <Select
                options={tipoPagoOptions}
                value={
                  tipoPagoOptions.find(
                    (opt) => opt.value === nuevoMedioPagoForm.values.tipoPagoId
                  ) || null
                }
                onChange={(selected) =>
                  nuevoMedioPagoForm.handleChange(
                    "tipoPagoId",
                    selected ? selected.value : 0
                  )
                }
                placeholder="Tipo Pago"
              />
              {/* Select estado */}
              <select
                value={nuevoMedioPagoForm.values.estado ? "true" : "false"}
                onChange={(e) =>
                  nuevoMedioPagoForm.handleChange(
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
              Lista de MedioPago
            </h2>
            {/* Control de carga inicial */}
            <div className="overflow-x-auto scrollbar-none">
              {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  Cargando...
                </p>
              ) : (
                <DataTable
                  data={medioPagos}
                  keyField="medioPagoId"
                  columns={columns}
                  editId={editandoId}
                  editData={editMedioPagoForm.values}
                  onEditChange={editMedioPagoForm.handleChange}
                  onSave={handleGuardar}
                  onCancel={handleCancelar}
                  extraHeader={<ExcelButton onClick={descargarExcel} />}
                  actions={{
                    render: (t) => (
                      <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                        <EditButton onClick={() => handleEditar(t)} />
                        <DeleteButton
                          onClick={() => handleEliminar(t.medioPagoId)}
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

export default MedioPagoPageAdmin;
