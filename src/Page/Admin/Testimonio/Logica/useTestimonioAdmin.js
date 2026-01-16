/**
 * Lógica para la administración de Testimonios
 * ------------------------------------------------------------------
 * Propósito:
 *  - Centralizar el flujo completo de gestión de testimonios desde el panel
 *    administrativo utilizando React Query.
 *  - Mantener los componentes UI limpios separando la lógica de negocio.
 *  - Validar formularios y gestionar notificaciones profesionales.
 *
 * Funcionalidades clave:
 *  - Consultar y mantener sincronizado el listado de testimonios.
 *  - Crear, modificar y eliminar elementos, actualizando correctamente la UI.
 *  - Controlar el estado de edición para una experiencia más intuitiva.
 *  - Exportación a Excel y manejo correcto de errores provenientes del servidor.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useTestimonios,
  useCrearTestimonio,
  useActualizarTestimonio,
  useEliminarTestimonio,
  useExportarExcelTestimonios,
} from "../../../../hooks/useTestimonio";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useTestimoniosAdmin = (
  nuevoTestimonioForm,
  editTestimonioForm
) => {
  // ID del carrito actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelTestimonios();
  // Servicio centralizado de notificaciones UI
  const notify = useAdminNotifier();
  // Consulta principal de datos del carrito (caché integrada)
  const { data: testimoniosData = [], isLoading } = useTestimonios();
  // Mutaciones CRUD
  const crearTestimonio = useCrearTestimonio();
  const updateTestimonio = useActualizarTestimonio();
  const deleteTestimonio = useEliminarTestimonio();

  // Ordenamiento de testimonios por fecha y nombre
  const testimonios = testimoniosData.slice().sort((a, b) => {
    const dateA = new Date(a.fechaRegistro).getTime();
    const dateB = new Date(b.fechaRegistro).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.nombreCompleto.localeCompare(b.nombreCompleto);
  });

  /** Crear testimonio */
  const handleCrear = async () => {
    // Evita enviar datos inválidos
    if (!(await nuevoTestimonioForm.validate())) {
      notify.validationError();
      return;
    }

    notify.createPromise(
      crearTestimonio
        .mutateAsync(nuevoTestimonioForm.values)
        .then(() => {
          queryClient.invalidateQueries(["testimonio"]);
          nuevoTestimonioForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (testimonio) => {
    setEditandoId(testimonio.testimonioId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editTestimonioForm.setValues({
      descripcion: testimonio.descripcion || "",
      usuarioId: testimonio.usuarioId || "",
      evaluacion: testimonio.evaluacion || "",
      estado: testimonio.estado ?? true,
    });
  };

  /** Guardar cambios */
  const handleGuardar = async () => {
    if (!(await editTestimonioForm.validate())) {
      notify.validationError();
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = {
      testimonioId: editandoId,
      ...editTestimonioForm.values,
    };

    notify.updatePromise(
      updateTestimonio
        .mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editTestimonioForm.resetForm();
          queryClient.invalidateQueries(["testimonio"]);
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  //** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editTestimonioForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar testimonio */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteTestimonio
        .mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editTestimonioForm.resetForm();
          }

          nuevoTestimonioForm.resetForm();

          queryClient.setQueryData(["testimonios"], (old) =>
            old ? old.filter((r) => r.testimonioId !== id) : []
          );

          queryClient.invalidateQueries(["testimonios"]);
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  /** Exportar la lista de anuncios en un archivo Excel */
  const descargarExcel = async () => {
    notify.exportPromise(
      exportarExcel
        .mutateAsync()
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "testimonio.xlsx");

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
    testimonios,
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
