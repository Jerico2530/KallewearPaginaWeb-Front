/**
 * Lógica para la administración de Noticias.
 *
 * Propósito:
 *  - Gestionar todo el flujo de CRUD de Noticias usando React Query.
 *  - Centralizar la lógica de creación, edición, eliminación y exportación de datos.
 *  - Mantener la UI más limpia separando la capa lógica.
 *
 * Funcionalidades clave:
 *  - Obtener lista de noticias con caché y control de sincronización.
 *  - Validar formularios antes de registrar o actualizar datos.
 *  - Control de estado de edición para la interfaz.
 *  - Notificaciones de éxito y errores del servidor.
 *  - Exportación de datos a Excel proveniente del backend.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useNoticias,
  useCrearNoticia,
  useActualizarNoticia,
  useEliminarNoticia,
  useExportarExcelNoticias,
} from "../../../../hooks/useNoticias";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useNoticiasAdmin = (nuevoNoticiaForm, editNoticiaForm) => {
  // ID del registro que se está editando (control de modo edición UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelNoticias();
  // Servicio global de notificaciones
  const notify = useAdminNotifier();
  // Consulta principal: obtiene todos los anuncios desde la API
  const { data: noticiasData = [], isLoading } = useNoticias();
  // Mutaciones CRUD
  const crearNoticia = useCrearNoticia();
  const updateNoticia = useActualizarNoticia();
  const deleteNoticia = useEliminarNoticia();

  // Ordenamiento consistente: fecha y nombre
  const noticias = noticiasData.slice().sort((a, b) => {
    const dateA = new Date(a.fechaRegistro).getTime();
    const dateB = new Date(b.fechaRegistro).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.titulo.localeCompare(b.titulo);
  });

  /** Crear noticia */
  const handleCrear = async () => {
    // Evita enviar datos inválidos a la API
    if (!(await nuevoNoticiaForm.validate())) {
      notify.validationError();
      return;
    }
    notify.createPromise(
      crearNoticia
        .mutateAsync(nuevoNoticiaForm.values)
        .then(() => {
          queryClient.invalidateQueries(["noticia"]);
          nuevoNoticiaForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  /** Inicia edición cargando datos existentes en el formulario */
  const handleEditar = (noticia) => {
    setEditandoId(noticia.noticiaId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editNoticiaForm.setValues({
      titulo: noticia.titulo || "",
      descripcion: noticia.descripcion || "",
      imagen: noticia.imagen || "",
      fechaPublicacion: noticia.fechaPublicacion?.substring(0, 10) || "",
      estado: noticia.estado ?? true,
    });
  };

  /** Guardar cambios del anuncio editado */
  const handleGuardar = async () => {
    if (!(await editNoticiaForm.validate())) {
      notify.validationError();
      return;
    }

    const dataEditar = { noticiaId: editandoId, ...editNoticiaForm.values };

    notify.updatePromise(
      updateNoticia
        .mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editNoticiaForm.resetForm();
          queryClient.invalidateQueries(["noticia"]);
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
    editNoticiaForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar anuncio con confirmación de usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteNoticia
        .mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editNoticiaForm.resetForm();
          }

          nuevoNoticiaForm.resetForm();

          queryClient.setQueryData(["noticias"], (old) =>
            old ? old.filter((u) => u.noticiaId !== id) : []
          );

          queryClient.invalidateQueries(["noticias"]);
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  // ** Exportar la lista de anuncios en un archivo Excel */
  const descargarExcel = () => {
    notify.exportPromise(
      exportarExcel
        .mutateAsync()
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "noticias.xlsx");

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
    noticias,
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
