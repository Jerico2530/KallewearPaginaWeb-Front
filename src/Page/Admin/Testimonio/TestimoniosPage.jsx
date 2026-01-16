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

/**
 * Página de Administración de Testimonios
 * ----------------------------------------------------
 * - CRUD de testimonios
 * - React Query
 * - Tipografía centralizada (typography.css)
 * - Layout idéntico a UsuariosPageAdmin
 */
import React from "react";
import PageCrud from "../Pagess/PageCrud";
import DataTable from "../../../components/UI/DataTable";
import { useForm } from "../LogicaAdmin/useForm";
import { TestimonioInicial } from "../../../constants/testimonioConstantes";
import { TestimonioValidacion } from "../../../validation/TestimonioValidacion";
import { useTestimoniosAdmin } from "./Logica/useTestimonioAdmin";
import { useUsuarios } from "../../../hooks/useUsuario";
import Select from "react-select";
import { tableRenderers } from "./Constans/tableRenderers";
import { testimonioFormSchema } from "./Constans/testimonioFormSchema";
import { editableRenderers } from "./Constans/editableRenderers";
import { DynamicField } from "./Constans/DynamicField";
import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ExcelButton,
} from "../../../components/UI/LogicaButton";

const TestimoniosPageAdmin = () => {
  const nuevoTestimonioForm = useForm(TestimonioInicial, TestimonioValidacion);
  const editTestimonioForm = useForm(TestimonioInicial, TestimonioValidacion);

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

  const { data: usuarios = [] } = useUsuarios();
  const usuarioOptions = usuarios.map((u) => ({
    value: u.usuarioId,
    label: u.nombreCompleto,
  }));

  const renderSelectValue = (id) =>
    usuarioOptions.find((o) => o.value === id)?.label || "-";

  /* ================== Generar columnas dinámicas ================== */

  const columns = Object.entries(testimonioFormSchema)
    .filter(([, schema]) => schema.table)
    .map(([key, schema]) => ({
      key,
      label: schema.label,
      className: schema.table.className || "",

      render: (row) => {
        const type = schema.table.type;
        return tableRenderers[type]
          ? tableRenderers[type](row[key], row, { usuarios })
          : row[key];
      },

      editable: schema.table.editable
        ? {
            render: (data, onChange) => {
              const value = data[key];
              const editableType = schema.table.editable.type;

              // ✅ CONSUMO CORRECTO DE editableRenderers
              if (editableRenderers[editableType]) {
                return editableRenderers[editableType]({
                  value,
                  onChange,
                  schema,
                  field: key,
                });
              }

              // fallback
              return (
                <input
                  type={editableType || "text"}
                  value={value ?? ""}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-full rounded-md px-2 py-1.5 border
                border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-800"
                />
              );
            },
          }
        : undefined,
    }));

  const handleCrearConValidacion = async () => {
    const valido = await nuevoTestimonioForm.validate();
    if (!valido) return;
    handleCrear();
  };

  return (
    <PageCrud activeTab="testimonio">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-6">
        {/* HEADER */}
        <div className="border-b pb-4 dark:border-gray-700">
          <h1 className="heading-page text-center">
            Administración de Testimonios
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* ================= FORMULARIO ================= */}
          <aside className="w-full md:w-[300px] self-start sticky top-6 h-fit bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 shadow-sm">
            <h2 className="heading-block border-b pb-2 dark:border-gray-700">
              Nuevo Testimonio
            </h2>

            <div className="space-y-3">
              {Object.entries(testimonioFormSchema).map(([key, config]) => {
                if (!TestimonioInicial.hasOwnProperty(key)) return null;

                return (
                  <DynamicField
                    key={key}
                    fieldKey={key}
                    config={config}
                    value={nuevoTestimonioForm.values[key]}
                    error={nuevoTestimonioForm.errors[key]}
                    onChange={nuevoTestimonioForm.handleChange}
                    optionsData={{
                      usuarios: usuarioOptions,
                    }}
                  />
                );
              })}
              <div className="flex justify-end pt-2">
                <AddButton onClick={handleCrearConValidacion} label="Agregar" />
              </div>
            </div>
          </aside>
          {/* ================= TABLA ================= */}
          <section className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="heading-block">Testimonios</h2>
              <ExcelButton onClick={descargarExcel} />
            </div>

            {isLoading ? (
              <p className="text-secondary text-center py-10">
                Cargando testimonios...
              </p>
            ) : (
              <DataTable
                data={testimonios}
                keyField="testimonioId"
                enableSearch
                columns={columns}
                editId={editandoId}
                editData={editTestimonioForm.values}
                onEditChange={editTestimonioForm.handleChange}
                onSave={handleGuardar}
                onCancel={handleCancelar}
                actions={{
                  render: (t) => (
                    <div className="flex gap-2 justify-center">
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
          </section>
        </div>
      </div>
    </PageCrud>
  );
};

export default TestimoniosPageAdmin;
