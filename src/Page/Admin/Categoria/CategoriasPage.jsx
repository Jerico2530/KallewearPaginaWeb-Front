/**
 * Página de Administración de Categorías
 *
 * Propósito del componente:
 *   - Gestionar el CRUD de categorías dentro del panel administrativo.
 *   - Ofrecer una interfaz profesional de gestión mediante formulario y tabla editable.
 *
 * Funcionalidades clave del proyecto:
 *   - Validación de campos y control del estado de edición.
 *   - Tabla interactiva con edición en línea y exportación de datos a Excel.
 *   - Conexión a React Query para manejo eficiente de datos en caché.
 *   - Diseño adaptable con modo oscuro habilitado.
 */
import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { CategoriaInicial } from "../../../constants/categoriaConstantes";
import { CategoriaValidacion } from "../../../validation/CategoriaValidacion";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ExcelButton,
} from "../../../components/UI/LogicaButton";
import { useForm } from "../LogicaAdmin/useForm";
import { useCategoriaAdmin } from "./Logica/useCategoriaAdmin";

const CategoriasPageAdmin = () => {
  // Formularios controlados para creación y edición
  const nuevoCategoriaForm = useForm(CategoriaInicial, CategoriaValidacion);
  const editCategoriaForm = useForm(CategoriaInicial, CategoriaValidacion);

  // logica que encapsula toda la lógica de negocio del módulo
  const {
    categorias,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useCategoriaAdmin(nuevoCategoriaForm, editCategoriaForm);

   /**
   * Configuración de columnas para DataTable.
   * Cada columna define su visualización y, si aplica, su mecanismo de edición.
   */
  const columns = [
    { key: "desCategoria", label: "Descripción", editable: { type: "text" } },
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
  // Validación extra antes de crear un categoria
  const handleCrearConValidacion = async () => {
    const valido = await nuevoCategoriaForm.validate();
    if (!valido) return; // Si hay errores, no continua
    handleCrear();
  };

  return (
    <PageCrud activeTab="categoria">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-2xl max-w-full mx-auto p-4 sm:p-6 space-y-6 border dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center border-b pb-4 dark:border-secondary text-gray-800 dark:text-gray-100">
          Administración de Categorías
        </h1>

        {/* Distribución principal: formulario + tabla */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-8 w-full justify-center">
          {/* Panel de creación */}
          <div className="w-full md:w-1/4 max-w-xs self-start h-fit bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg space-y-4 sm:space-y-5 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-3 text-gray-700 dark:text-gray-200">
              Agregar Categoría
            </h2>
            {/* Inputs dinámicos generados por la estructura del modelo */}
            <div className="flex flex-col gap-2 sm:gap-3">
              {Object.keys(CategoriaInicial).map((key) =>
                key !== "estado" ? (
                  <div key={key} className="flex flex-col gap-1">
                    <input
                      type={"text"}
                      placeholder={key}
                      value={nuevoCategoriaForm.values[key]}
                      onChange={(e) =>
                        nuevoCategoriaForm.handleChange(key, e.target.value)
                      }
                      className={`border rounded-lg w-full px-3 py-2 text-sm sm:text-base focus:ring-2 ${
                        nuevoCategoriaForm.errors[key]
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } dark:bg-gray-700 dark:text-gray-100 transition`}
                    />

                    {/* 🟢 Mostrar error debajo del input */}
                    {nuevoCategoriaForm.errors[key] && (
                      <span className="text-xs text-red-500 font-medium">
                        {nuevoCategoriaForm.errors[key]}
                      </span>
                    )}
                  </div>
                ) : null
              )}
              {/* Selector de estado */}
              <select
                value={nuevoCategoriaForm.values.estado ? "true" : "false"}
                onChange={(e) =>
                  nuevoCategoriaForm.handleChange(
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
              Lista de Categorías
            </h2>
            {/* Control de carga inicial */}
            <div className="overflow-x-auto scrollbar-none">
              {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  Cargando...
                </p>
              ) : (
                <DataTable
                  data={categorias}
                  keyField="categoriaId"
                  columns={columns}
                  editId={editandoId}
                  editData={editCategoriaForm.values}
                  onEditChange={editCategoriaForm.handleChange}
                  onSave={handleGuardar}
                  onCancel={handleCancelar}
                  extraHeader={<ExcelButton onClick={descargarExcel} />}
                  actions={{
                    render: (t) => (
                      <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                        <EditButton onClick={() => handleEditar(t)} />
                        <DeleteButton
                          onClick={() => handleEliminar(t.categoriaId)}
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

export default CategoriasPageAdmin;
