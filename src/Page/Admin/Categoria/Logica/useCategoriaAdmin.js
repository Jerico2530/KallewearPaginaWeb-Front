/**
 * Lógica para la administración de Categorías.
 * ------------------------------------------------------------------
 * Propósito:
 *  - Centralizar el flujo completo de gestión de categorías desde el panel
 *    administrativo utilizando React Query.
 *  - Mantener la interfaz desacoplada de la lógica de negocio.
 *  - Validar formularios y manejar notificaciones de forma profesional.
 *
 * Funcionalidades clave:
 *  - Consultar y mantener sincronizado el listado de categorías.
 *  - Crear, editar y eliminar registros con actualización inmediata de la UI.
 *  - Controlar el estado de edición para mejorar usabilidad.
 *  - Manejo seguro de errores provenientes del servidor.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCategorias,
  useCrearCategoria,
  useActualizarCategoria,
  useEliminarCategoria,
  useExportarExcelCategorias,
} from "../../../../hooks/useCategoria";
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useCategoriaAdmin = (nuevoCategoriaForm, editCategoriaForm) => {
  // ID actualmente en edición (controla modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // Servicio para mensajes de éxito / error / confirmación
  const queryClient = useQueryClient();
  // Exportación de datos a Excel sin afectar estado visual
  const exportarExcel = useExportarExcelCategorias();
  // Servicio para mensajes de éxito / error / confirmación
  const notify = useNotification();
  // Consulta inicial de categorías, con control de estado de carga
  const { data: categorias = [], isLoading } = useCategorias();
  // Mutaciones CRUD asociadas
  const crearCategoria = useCrearCategoria();
  const updateCategoria = useActualizarCategoria();
  const deleteCategoria = useEliminarCategoria();

  /** Crear una nueva categoría */
  const handleCrear = async () => {
    // Evita enviar datos inválidos
    if (!(await nuevoCategoriaForm.validate())) {
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearCategoria.mutate(nuevoCategoriaForm.values, {
      onSuccess: () => {
        notify.success("Categoria creado correctamente");
        // Mantiene los datos sincronizados con el backend
        queryClient.invalidateQueries(["categoria"]);
        // Limpia el formulario para nueva creación
        nuevoCategoriaForm.resetForm();
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (categoria) => {
    setEditandoId(categoria.categoriaId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editCategoriaForm.setValues({
      desCategoria: categoria.desCategoria || "",
      estado: categoria.estado ?? true,
    });
  };

  /** Guardar cambios de edición */
  const handleGuardar = async () => {
    if (!(await editCategoriaForm.validate())) {
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { categoriaId: editandoId, ...editCategoriaForm.values };

    updateCategoria.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Categoria actualizado correctamente");
        setEditandoId(null);
        editCategoriaForm.resetForm();
        queryClient.invalidateQueries(["Categoria"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editCategoriaForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar un carrito con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar esta categoría?"
    );
    if (!confirmar) return;

    deleteCategoria.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Categoría eliminada correctamente");

          // Si el elemento eliminado estaba en edición, salir del modo edición
          if (editandoId === id) {
            setEditandoId(null);
            editCategoriaForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoCategoriaForm.resetForm();

          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["categorias"], (old) =>
            old ? old.filter((c) => c.categoriaId !== id) : []
          );

          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["categorias"]);
        }
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Descargar registro de categorías en formato Excel */
  const descargarExcel = async () => {
    try {
      const response = await exportarExcel.mutateAsync();

      // Crear el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un link temporal
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "categoria.xlsx"); // nombre del archivo

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
    categorias,
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
