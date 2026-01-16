/**
 * Lógica para la administración de Géneros.
 *
 * Propósito:
 *  - Gestionar el flujo completo de CRUD de Géneros usando React Query.
 *  - Centralizar la lógica de creación, edición, eliminación y exportación.
 *  - Mantener la UI limpia separando la lógica de negocio en un hook reutilizable.
 *
 * Funcionalidades clave:
 *  - Cargar lista de géneros con caché y sincronización automática.
 *  - Validar formularios antes de guardar o editar datos.
 *  - Controlar estados de edición y UI (activar/desactivar edición).
 *  - Notificaciones profesionales de éxito/error/confirmación.
 *  - Exportar datos en formato Excel mediante API.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGeneros,
  useCrearGenero,
  useActualizarGenero,
  useEliminarGenero,
  useExportarExcelGeneros,
} from "../../../../hooks/useGenero";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useGenerosAdmin = (nuevoGeneroForm, editGeneroForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelGeneros();
  // Servicio global de notificaciones
  const notify = useAdminNotifier();
  // Consulta principal: obtiene todos los anuncios desde la API
  const { data: generos = [], isLoading } = useGeneros();
  // Mutaciones CRUD
  const crearGenero = useCrearGenero();
  const updateGenero = useActualizarGenero();
  const deleteGenero = useEliminarGenero();

  /** Crear Genero */
  const handleCrear = async () => {
    // Evita enviar datos inválidos a la API
    if (!(await nuevoGeneroForm.validate())) {
      notify.validationError();
      return;
    }

    notify.createPromise(
      crearGenero
        .mutateAsync(nuevoGeneroForm.values)
        .then(() => {
          queryClient.invalidateQueries(["Genero"]);
          nuevoGeneroForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  /** Inicia edición cargando datos existentes en el formulario */
  const handleEditar = (genero) => {
    setEditandoId(genero.generoId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editGeneroForm.setValues({
      tipo: genero.tipo || "",
      estado: genero.estado ?? true,
    });
  };

  /** Guardar cambios del anuncio editado */
  const handleGuardar = async () => {
    if (!(await editGeneroForm.validate())) {
      notify.validationError();
      return;
    }

    const dataEditar = { generoId: editandoId, ...editGeneroForm.values };

    notify.updatePromise(
      updateGenero
        .mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editGeneroForm.resetForm();
          queryClient.invalidateQueries(["Genero"]);
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
    editGeneroForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar anuncio con confirmación de usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteGenero
        .mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editGeneroForm.resetForm();
          }

          nuevoGeneroForm.resetForm();

          queryClient.setQueryData(["generos"], (old) =>
            old ? old.filter((u) => u.generoId !== id) : []
          );

          queryClient.invalidateQueries(["generos"]);
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  /** Exportar la lista de anuncios en un archivo Excel */
  const descargarExcel = () => {
    notify.exportPromise(
      exportarExcel
        .mutateAsync()
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "genero.xlsx");

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
    generos,
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
