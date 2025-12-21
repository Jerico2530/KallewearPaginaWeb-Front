// src/pages/admin/DescuentoPageAdmin.jsx
import React, { useState } from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
} from "../../../components/UI/LogicaButton";
import { DescuentoInicial } from "../../../constants/descuentoConstantes";
import { DescuentoValidacion } from "../../../validation/DescuentoValidacion";
import { useForm } from "../LogicaAdmin/useForm";
import { useDescuentoAdmin } from "./Logica/useDescuentoAdmin";

const DescuentoPageAdmin = () => {
  const nuevoDescuentoForm = useForm(DescuentoInicial, DescuentoValidacion);
  const editDescuentoForm = useForm(DescuentoInicial, DescuentoValidacion);

  const {
    descuentos,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
  } = useDescuentoAdmin(nuevoDescuentoForm, editDescuentoForm);

  /** Columnas dinámicas para DataTable */
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
    { key: "nombreDescuento", label: "Nombre", editable: { type: "text" } },
    {
      key: "porcentaje",
      label: "%",
      render: (d) => `${d.porcentaje ?? 0}%`,
      editable: { type: "number" },
    },
    {
      key: "fechaInicio",
      label: "Inicio",
      editable: { type: "date" },
    },
    {
      key: "fechaFin",
      label: "Fin",
      editable: { type: "date" },
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

  const handleCrearConValidacion = async () => {
    const valido = await nuevoDescuentoForm.validate();
    if (!valido) return; // Si hay errores, no continua
    handleCrear();
  };

  return (
    <PageCrud activeTab="descuento">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-2xl max-w-full mx-auto p-4 sm:p-6 space-y-6 border dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center border-b pb-4 dark:border-secondary text-gray-800 dark:text-gray-100">
          Administración de Descuentos
        </h1>

        <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-8 w-full justify-center">
          {/* Formulario */}
          <div className="w-full md:w-1/4 max-w-xs self-start h-fit bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg space-y-4 sm:space-y-5 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold border-b pb-2 mb-3 text-gray-700 dark:text-gray-200">
              Agregar Descuento
            </h2>
            <div className="flex flex-col gap-2 sm:gap-3">
              {Object.keys(DescuentoInicial).map((key) =>
                key !== "estado" ? (
                  <div key={key} className="flex flex-col gap-1">
                    <input
                      type={
                        key.toLowerCase().includes("porcentaje")
                          ? "number"
                          : key.toLowerCase().includes("fecha")
                          ? "date"
                          : "text"
                      }
                      placeholder={key}
                      value={nuevoDescuentoForm.values[key] || ""}
                      onChange={(e) => {
                        const value = key.toLowerCase().includes("porcentaje")
                          ? Number(e.target.value)
                          : e.target.value;
                        nuevoDescuentoForm.handleChange(key, value);
                      }}
                      min={
                        key.toLowerCase().includes("porcentaje") ? 0 : undefined
                      }
                      max={
                        key.toLowerCase().includes("porcentaje")
                          ? 100
                          : undefined
                      }
                      step={
                        key.toLowerCase().includes("porcentaje")
                          ? "0.01"
                          : undefined
                      }
                      className={`border rounded-lg w-full px-3 py-2 text-sm sm:text-base focus:ring-2 ${
                        nuevoDescuentoForm.errors[key]
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } dark:bg-gray-700 dark:text-gray-100 transition`}
                    />

                    {/* 🟢 Mostrar error debajo del input */}
                    {nuevoDescuentoForm.errors[key] && (
                      <span className="text-xs text-red-500 font-medium">
                        {nuevoDescuentoForm.errors[key]}
                      </span>
                    )}
                  </div>
                ) : null
              )}

              <select
                value={nuevoDescuentoForm.values.estado ? "true" : "false"}
                onChange={(e) =>
                  nuevoDescuentoForm.handleChange(
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
              Lista de Descuentos
            </h2>
            <div className="overflow-x-auto scrollbar-none">
              {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-300">
                  Cargando...
                </p>
              ) : (
                <DataTable
                  data={descuentos}
                  keyField="descuentoId"
                  columns={columns}
                  editId={editandoId}
                  editData={editDescuentoForm.values}
                  onEditChange={editDescuentoForm.handleChange}
                  onSave={handleGuardar}
                  onCancel={handleCancelar}
                  actions={{
                    render: (d) => (
                      <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                        <EditButton onClick={() => handleEditar(d)} />
                        <DeleteButton
                          onClick={() => handleEliminar(d.descuentoId)}
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

export default DescuentoPageAdmin;
