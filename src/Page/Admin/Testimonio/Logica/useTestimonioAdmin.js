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
import { useNotification } from "../../../../utils/NotificationService";
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
  const notify = useNotification();
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
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearTestimonio.mutate(nuevoTestimonioForm.values, {
      onSuccess: () => {
        notify.success("Testimonio creado correctamente");
        queryClient.invalidateQueries(["testimonio"]); // sincroniza la vista
        nuevoTestimonioForm.resetForm(); // limpia campos
      },
      onError: (error) => handleApiError(error, notify),
    });
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
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = {
      testimonioId: editandoId,
      ...editTestimonioForm.values,
    };

    updateTestimonio.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Testimonio actualizado correctamente");
        setEditandoId(null);
        editTestimonioForm.resetForm();
        queryClient.invalidateQueries(["testimonio"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  //** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editTestimonioForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar testimonio */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este testimonio?"
    );
    if (!confirmar) return;

    deleteTestimonio.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Testimonio eliminado correctamente");
          // Si el elemento eliminado estaba en edición, salir del modo edición
          if (editandoId === id) {
            setEditandoId(null);
            editTestimonioForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoTestimonioForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["testimonios"], (old) =>
            old ? old.filter((c) => c.testimonioId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["testimonios"]);
        }
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Exportar la lista de anuncios en un archivo Excel */
  const descargarExcel = async () => {
    try {
      const response = await exportarExcel.mutateAsync();

      // Crear el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un link temporal
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "testimonio.xlsx"); // nombre del archivo

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
