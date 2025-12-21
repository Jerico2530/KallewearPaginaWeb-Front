/**
 * Página de Administración de Testimonios
 * ------------------------------------------------------------------
 * Propósito del componente:
 *   - Gestionar el CRUD de testimonios (crear, listar, editar, eliminar) dentro del panel administrativo.
 *   - Ofrecer edición en línea y validación controlada de datos.
 *
 * Funcionalidades clave del proyecto:
 *   - Manejo centralizado de estados del formulario (crear/editar).
 *   - Integración con React Query para obtener y mutar datos de forma eficiente.
 *   - Tabla interactiva con renderizado personalizado de campos y modo edición.
 *   - Exportación a Excel y manejo de notificaciones.
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
import Select from "react-select";
import { useForm } from "../LogicaAdmin/useForm";
import { TestimonioValidacion } from "../../../validation/TestimonioValidacion";
import { useTestimoniosAdmin } from "./Logica/useTestimonioAdmin";
import { TestimonioInicial } from "../../../constants/testimonioConstantes";
import { useUsuarios } from "../../../hooks/useUsuario";

const TestimoniosPageAdmin = () => {
  // Formularios separados para creación y edición
  const nuevoTestimonioForm = useForm(TestimonioInicial, TestimonioValidacion);
  const editTestimonioForm = useForm(TestimonioInicial, TestimonioValidacion);
  // Hook que encapsula toda la lógica de negocio del módulo
  const {
    testimonios,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useTestimoniosAdmin(nuevoTestimonioForm, editTestimonioForm);
  /** Opciones para selects: Usuarios  */
  const { data: usuarios = [] } = useUsuarios();

  // Transformación de datos para react-select
  const usuarioOptions = usuarios.map((m) => ({
    value: m.usuarioId,
    label: m.nombreCompleto,
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
    {
      key: "descripcion",
      label: "Descripción",
      editable: { type: "textarea" },
    },

    {
      key: "evaluacion",
      label: "Evaluación",
      render: (t) => t.evaluacion + " ⭐",
      editable: {
        render: (data, onChange) => (
          <select
            value={data.evaluacion}
            onChange={(e) => onChange("evaluacion", parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} ⭐
              </option>
            ))}
          </select>
        ),
      },
    },
    {
      key: "fechaRegistro",
      label: "Fecha",
      render: (t) => new Date(t.fechaRegistro).toLocaleDateString(),
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
    const valido = await nuevoTestimonioForm.validate();
    if (!valido) return; // Si hay errores, no continua
    handleCrear();
  };

  return (
    <PageCrud activeTab="testimonio">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-2xl max-w-full mx-auto p-4 sm:p-6 space-y-6 border dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center border-b pb-4 dark:border-secondary text-gray-800 dark:text-gray-100">
          Administración de Testimonios
        </h1>
        {/* Distribución principal: formulario + tabla */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-8 w-full justify-center">
          {/* Panel de creación */}
          <div className="w-full md:w-1/4 max-w-xs self-start h-fit bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg space-y-4 sm:space-y-5 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-3 text-gray-700 dark:text-gray-200">
              Agregar Testimonio
            </h2>
            {/* Inputs dinámicos generados por la estructura del modelo */}
            <div className="flex flex-col gap-2 sm:gap-3">
              {Object.keys(TestimonioInicial).map((key) =>
                key !== "estado" &&
                key !== "usuarioId" &&
                key !== "evaluacion" ? (
                  <div key={key}>
                    <textarea
                      type={"text"}
                      placeholder={key}
                      value={nuevoTestimonioForm.values[key] || ""}
                      onChange={(e) =>
                        nuevoTestimonioForm.handleChange(key, e.target.value)
                      }
                      className={`border rounded-lg w-full px-3 py-2 focus:ring-2 ${
                        nuevoTestimonioForm.errors[key]
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } dark:bg-gray-700 dark:text-gray-100`}
                    />
                    {nuevoTestimonioForm.errors[key] && (
                      <span className="text-xs text-red-500">
                        {nuevoTestimonioForm.errors[key]}
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
                    (opt) => opt.value === nuevoTestimonioForm.values.usuarioId
                  ) || null
                }
                onChange={(selected) =>
                  nuevoTestimonioForm.handleChange(
                    "usuarioId",
                    selected ? selected.value : 0
                  )
                }
                placeholder="Usuario"
              />
              {/* Select estado */}
              <select
                value={nuevoTestimonioForm.values.evaluacion || 1}
                onChange={(e) =>
                  nuevoTestimonioForm.handleChange(
                    "evaluacion",
                    parseInt(e.target.value)
                  )
                }
                className="border rounded-lg w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 transition"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} ⭐
                  </option>
                ))}
              </select>

              <select
                value={nuevoTestimonioForm.values.estado ? "true" : "false"}
                onChange={(e) =>
                  nuevoTestimonioForm.handleChange(
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
              Lista de Testimonios
            </h2>
            {/* Control de carga inicial */}
            <div className="overflow-x-auto scrollbar-none">
              {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  Cargando...
                </p>
              ) : (
                <DataTable
                  data={testimonios}
                  keyField="testimonioId"
                  columns={columns}
                  editId={editandoId}
                  editData={editTestimonioForm.values}
                  onEditChange={editTestimonioForm.handleChange}
                  onSave={handleGuardar}
                  onCancel={handleCancelar}
                  extraHeader={<ExcelButton onClick={descargarExcel} />}
                  actions={{
                    render: (t) => (
                      <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                        <EditButton onClick={() => handleEditar(t)} />
                        <DeleteButton
                          onClick={() => handleEliminar(t.testimonioId)}
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

export default TestimoniosPageAdmin;
