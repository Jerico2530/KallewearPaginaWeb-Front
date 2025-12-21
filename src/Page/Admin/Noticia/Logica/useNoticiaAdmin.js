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
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useNoticiasAdmin = (nuevoNoticiaForm, editNoticiaForm) => {
  // ID del registro que se está editando (control de modo edición UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelNoticias();
  // Servicio global de notificaciones
  const notify = useNotification();
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
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearNoticia.mutate(nuevoNoticiaForm.values, {
      onSuccess: () => {
        notify.success("Noticia creado correctamente");
        queryClient.invalidateQueries(["noticia"]);
        nuevoNoticiaForm.resetForm();
      },
      onError: (error) => handleApiError(error, notify),
    });
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
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }

    const dataEditar = { noticiaId: editandoId, ...editNoticiaForm.values };

    updateNoticia.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Noticia actualizado correctamente");
        setEditandoId(null);
        editNoticiaForm.resetForm();
        queryClient.invalidateQueries(["noticia"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar modo edición sin guardar cambios */
  const handleCancelar = () => {
    setEditandoId(null);
    editNoticiaForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar anuncio con confirmación de usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este noticia?"
    );
    if (!confirmar) return;

    deleteNoticia.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Noticia eliminado correctamente");

          // 🧩 Limpieza inmediata del form y cache coherente
          if (editandoId === id) {
            setEditandoId(null);
            editNoticiaForm.resetForm();
          }

          nuevoNoticiaForm.resetForm();

          queryClient.setQueryData(["noticias"], (old) =>
            old ? old.filter((c) => c.noticiaId !== id) : []
          );

          queryClient.invalidateQueries(["noticias"]);
        }
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  // ** Exportar la lista de anuncios en un archivo Excel */
  const descargarExcel = async () => {
    try {
      const response = await exportarExcel.mutateAsync();

      // Crear el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un link temporal
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "noticias.xlsx"); // nombre del archivo

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
