/**
 * Logica para la administración de Anuncios.
 *
 * Propósito:
 *  - Gestionar todo el flujo de CRUD de Anuncios usando React Query.
 *  - Centralizar la lógica de creación, edición, eliminación y exportación de datos.
 *  - Mantener componentes más limpios y separados de la lógica de negocio.
 *
 * Funcionalidades clave:
 *  - Obtener lista de anuncios con caché y sincronización automática.
 *  - Validar formularios antes de guardar o actualizar información.
 *  - Controlar estados de edición UI (modo edición activo/inactivo).
 *  - Notificaciones profesionales de éxito/error.
 *  - Exportar datos como archivo Excel generado por la API.
 *
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAnuncios,
  useCrearAnuncio,
  useUpdateAnuncio,
  useDeleteAnuncio,
  useExportarExcelAnuncios,
} from "../../../../hooks/useAnuncio";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useAnunciosAdmin = (nuevoAnuncioForm, editAnuncioForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelAnuncios();
  // Servicio global de notificaciones
  const notify = useAdminNotifier();
  // Consulta principal: obtiene todos los anuncios desde la API
  const { data: anuncios = [], isLoading } = useAnuncios();
  // Mutaciones CRUD
  const crearAnuncio = useCrearAnuncio();
  const updateAnuncio = useUpdateAnuncio();
  const deleteAnuncio = useDeleteAnuncio();

  /** Crear Anuncio */
  const handleCrear = async () => {
    // Evita enviar datos inválidos a la API
    if (!(await nuevoAnuncioForm.validate())) {
      notify.validationError();
      return;
    }
    notify.createPromise(
      crearAnuncio.mutateAsync(nuevoAnuncioForm.values)
        .then(() => {
          queryClient.invalidateQueries(["anuncios"]);
          nuevoAnuncioForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  /** Inicia edición cargando datos existentes en el formulario */
  const handleEditar = (anuncio) => {
    setEditandoId(anuncio.anuncioId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editAnuncioForm.setValues({
      titulo: anuncio.titulo || "",
      descripcion: anuncio.descripcion || "",
      imagen: anuncio.imagen || "",
      fechaInicio: anuncio.fechaInicio?.substring(0, 10) || "",
      fechaFinal: anuncio.fechaFinal?.substring(0, 10) || "",
      orden: anuncio.orden,
      estado: anuncio.estado ?? true,
    });
  };

  /** Guardar cambios del anuncio editado */
  const handleGuardar = async () => {
    if (!(await editAnuncioForm.validate())) {
      nonotify.validationError(); 
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { anuncioId: editandoId, ...editAnuncioForm.values };

    notify.updatePromise(
      updateAnuncio.mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editAnuncioForm.resetForm();
          queryClient.invalidateQueries(["anuncios"]);
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
    editAnuncioForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar anuncio con confirmación de anuncio */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteAnuncio.mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editAnuncioForm.resetForm();
          }

          nuevoAnuncioForm.resetForm();

          queryClient.setQueryData(["anuncios"], (old) =>
            old ? old.filter((u) => u.anuncioId !== id) : []
          );

          queryClient.invalidateQueries(["anuncios"]);
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
        const url = window.URL.createObjectURL(
          new Blob([response.data])
        );

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "anuncio.xlsx");

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        handleApiError(error, notify);
        throw error; 
      })
  );
};

  return {
    anuncios,
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
