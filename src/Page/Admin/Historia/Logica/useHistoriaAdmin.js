/**
 * Lógica para la administración de Historias
 *
 * Propósito:
 *  - Gestionar todo el flujo de CRUD de Historias usando React Query.
 *  - Centralizar validaciones, sincronización y estados de edición.
 *  - Mantener las páginas más limpias y enfocadas solo en la UI.
 *
 * Funcionalidades clave:
 *  - Obtener la lista de historias con caché y actualización automática.
 *  - Validar formularios antes de crear y actualizar registros.
 *  - Controlar el estado de edición con feedback al usuario.
 *  - Limpieza del estado tras eliminar o cancelar edición.
 *  - Exportar datos como archivo Excel descargable.
 */

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useHistorias,
  useCrearHistoria,
  useActualizarHistoria,
  useEliminarHistoria,
  useExportarExcelHistorias,
} from "../../../../hooks/useHistoria";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useHistoriasAdmin = (nuevoHistoriaForm, editHistoriaForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelHistorias();
  // Servicio global de notificaciones
  const notify = useAdminNotifier();
  // Consulta principal: obtiene todos los historias desde la API
  const { data: historias = [], isLoading } = useHistorias();
  // Mutaciones CRUD
  const crearHistoria = useCrearHistoria();
  const updateHistoria = useActualizarHistoria();
  const deleteHistoria = useEliminarHistoria();

  /** Crear Historia */
  const handleCrear = async () => {
    // Evita enviar datos inválidos a la API
    if (!(await nuevoHistoriaForm.validate())) {
      notify.validationError();
      return;
    }

    notify.createPromise(
      crearHistoria
        .mutateAsync(nuevoHistoriaForm.values)
        .then(() => {
          queryClient.invalidateQueries(["usuario"]);
          nuevoHistoriaForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  /** Inicia edición cargando datos existentes en el formulario */
  const handleEditar = (historia) => {
    setEditandoId(historia.historiaId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editHistoriaForm.setValues({
      titulo: historia.titulo || "",
      descripcion: historia.descripcion || "",
      año: historia.año?.substring(0, 10) || "",
      estado: historia.estado ?? true,
    });
  };

  /** Guardar cambios del historia editado */
  const handleGuardar = async () => {
    if (!(await editHistoriaForm.validate())) {
      notify.validationError();
      return;
    }

    const dataEditar = { historiaId: editandoId, ...editHistoriaForm.values };

    notify.updatePromise(
      updateHistoria
        .mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editHistoriaForm.resetForm();
          queryClient.invalidateQueries(["Historia"]);
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  /** Cancelar modo edición sin guardar cambios */
  const handleCancelar = () => {
    setEditandoId(null);
    editHistoriaForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar historia con confirmación de historia */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteHistoria
        .mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editHistoriaForm.resetForm();
          }

          nuevoHistoriaForm.resetForm();

          queryClient.setQueryData(["historias"], (old) =>
            old ? old.filter((u) => u.historiaId !== id) : []
          );

          queryClient.invalidateQueries(["historias"]);
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  /** Exportar la lista de historias en un archivo Excel */
  const descargarExcel = () => {
    notify.exportPromise(
      exportarExcel
        .mutateAsync()
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "historia.xlsx");

          document.body.appendChild(link);
          link.click();

          link.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error; // 🔑 NECESARIO para toast.promise
        })
    );
  };

  return {
    historias,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  };
};
