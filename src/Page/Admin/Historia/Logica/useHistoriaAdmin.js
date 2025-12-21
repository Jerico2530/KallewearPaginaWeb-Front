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
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useHistoriasAdmin = (nuevoHistoriaForm, editHistoriaForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelHistorias();
  // Servicio global de notificaciones
  const notify = useNotification();
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
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearHistoria.mutate(nuevoHistoriaForm.values, {
      onSuccess: () => {
        notify.success("Historia creado correctamente");
        queryClient.invalidateQueries(["Historia"]); // sincroniza lista
        nuevoHistoriaForm.resetForm(); // limpia formulario
      },
      onError: (error) => handleApiError(error, notify),
    });
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
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }

    const dataEditar = { historiaId: editandoId, ...editHistoriaForm.values };

    updateHistoria.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Historia actualizado correctamente");
        setEditandoId(null);
        editHistoriaForm.resetForm();
        queryClient.invalidateQueries(["Historia"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar modo edición sin guardar cambios */
  const handleCancelar = () => {
    setEditandoId(null);
    editHistoriaForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar historia con confirmación de historia */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este historia?"
    );
    if (!confirmar) return;

    deleteHistoria.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Historia eliminado correctamente");

          // Si el historia eliminado estaba siendo editado, reiniciar estado
          if (editandoId === id) {
            setEditandoId(null);
            editHistoriaForm.resetForm();
          }

          nuevoHistoriaForm.resetForm();
          // Actualiza caché local inmediatamente (optimización de UX)
          queryClient.setQueryData(["historias"], (old) =>
            old ? old.filter((c) => c.historiaId !== id) : []
          );

          queryClient.invalidateQueries(["historias"]);
        }
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Exportar la lista de historias en un archivo Excel */
  const descargarExcel = async () => {
    try {
      const response = await exportarExcel.mutateAsync();

      // Crear el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un link temporal
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "historia.xlsx"); // nombre del archivo

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      notify.success("Excel descargado correctamente");
    } catch (err) {
      notify.error("Error al descargar el Excel");
    }
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
