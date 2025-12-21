/**
 * Página de Administración de Anuncios
 *
 * Propósito del componente:
 *   - Gestionar el CRUD de anuncios (crear, listar, editar, eliminar) dentro del panel administrativo.
 *   - Presentar una interfaz profesional con formulario y tabla editable.
 *
 * Funcionalidades clave del proyecto:
 *   - Gestión de estados de edición con validación de formularios.
 *   - Tabla interactiva con edición en línea y exportación a Excel.
 *   - Integración con React Query para manejo de datos optimizado.
 *   - Experiencia responsiva y modo oscuro habilitado.
 *
 */
import React, { useState } from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "../LogicaAdmin/useForm";
import { AnuncioValidacion } from "../../../validation/AnuncioValidacion";
import { useAnunciosAdmin } from "./Logica/useAnuncioAdmin";
import { AnuncioInicial } from "../../../constants/anuncioConstantes";
import { AnuncioEditar } from "./Constans/AnuncioConstans";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ExcelButton,
} from "../../../components/UI/LogicaButton";

const AnunciosPageAdmin = () => {
  // Formularios controlados para crear y editar anuncios
  const nuevoAnuncioForm = useForm(AnuncioInicial, AnuncioValidacion);
  const editAnuncioForm = useForm(AnuncioEditar, AnuncioValidacion);

  // Hook con toda la lógica de negocio del módulo
  const {
    anuncios,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  } = useAnunciosAdmin(nuevoAnuncioForm, editAnuncioForm);

  /**
   * Configuración de columnas del DataTable.
   * Cada columna define cómo mostrar y cómo editar los datos.
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
          // Input personalizado para edición de imagen
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
    { key: "titulo", label: "Título", editable: { type: "text" } },
    {
      key: "descripcion",
      label: "Descripción",
      editable: { type: "textarea" },
    },
    {
      key: "fechaInicio",
      label: "Fecha Inicio",
      editable: { type: "date" },
      render: (a) => new Date(a.fechaInicio).toLocaleDateString(),
    },
    {
      key: "fechaFinal",
      label: "Fecha Final",
      editable: { type: "date" },
      render: (a) => new Date(a.fechaFinal).toLocaleDateString(),
    },
    { key: "orden", label: "Orden", editable: { type: "number" } },
    {
      key: "fechaRegistro",
      label: "Registro",
      render: (a) => new Date(a.fechaRegistro).toLocaleDateString(),
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

  // Validación extra antes de crear un anuncio
  const handleCrearConValidacion = async () => {
    const valido = await nuevoAnuncioForm.validate();
    if (!valido) return; // Si hay errores, no continua
    handleCrear();
  };

  return (
    <PageCrud activeTab="publicidad">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-2xl max-w-full mx-auto p-4 sm:p-6 space-y-6 border dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center border-b pb-4 dark:border-secondary text-gray-800 dark:text-gray-100">
          Administración de Anuncios
        </h1>

        {/* Distribución principal: formulario + tabla */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-8 w-full justify-center">
          {/* Panel de creación */}
          <div className="w-full md:w-1/4 max-w-xs self-start h-fit bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg space-y-4 sm:space-y-5 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-3 text-gray-700 dark:text-gray-200">
              Agregar Anuncio
            </h2>
            {/* Inputs dinámicos generados por la estructura del modelo */}
            <div className="flex flex-col gap-2 sm:gap-3">
              {Object.keys(AnuncioInicial).map((key) =>
                key !== "estado" ? (
                  <div key={key} className="flex flex-col gap-1">
                    <input
                      type={
                        ["contraseña", "contraseñaVisible"].includes(key)
                          ? "password"
                          : key.toLowerCase().includes("fecha")
                          ? "date"
                          : "text"
                      }
                      placeholder={key}
                      value={nuevoAnuncioForm.values[key]}
                      onChange={(e) =>
                        nuevoAnuncioForm.handleChange(key, e.target.value)
                      }
                      className={`border rounded-lg w-full px-3 py-2 text-sm sm:text-base focus:ring-2 ${
                        nuevoAnuncioForm.errors[key]
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } dark:bg-gray-700 dark:text-gray-100 transition`}
                    />
                    {/* 🟢 Mostrar error debajo del input */}
                    {nuevoAnuncioForm.errors[key] && (
                      <span className="text-xs text-red-500 font-medium">
                        {nuevoAnuncioForm.errors[key]}
                      </span>
                    )}
                  </div>
                ) : null
              )}
              {/* Selector de estado */}
              <select
                value={nuevoAnuncioForm.values.estado ? "true" : "false"}
                onChange={(e) =>
                  nuevoAnuncioForm.handleChange(
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
              Lista de Anuncios
            </h2>
            {/* Control de carga inicial */}
            <div className="overflow-x-auto scrollbar-none">
              {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  Cargando...
                </p>
              ) : (
                <DataTable
                  data={anuncios}
                  keyField="anuncioId"
                  columns={columns}
                  editId={editandoId}
                  editData={editAnuncioForm.values}
                  onEditChange={editAnuncioForm.handleChange}
                  onSave={handleGuardar}
                  onCancel={handleCancelar}
                  extraHeader={<ExcelButton onClick={descargarExcel} />}
                  actions={{
                    render: (a) => (
                      <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                        <EditButton onClick={() => handleEditar(a)} />
                        <DeleteButton
                          onClick={() => handleEliminar(a.anuncioId)}
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

export default AnunciosPageAdmin;
