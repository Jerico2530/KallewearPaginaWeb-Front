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
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useCategoriaAdmin = (nuevoCategoriaForm, editCategoriaForm) => {
  // ID actualmente en edición (controla modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // Servicio para mensajes de éxito / error / confirmación
  const queryClient = useQueryClient();
  // Exportación de datos a Excel sin afectar estado visual
  const exportarExcel = useExportarExcelCategorias();
  // Servicio para mensajes de éxito / error / confirmación
  const notify = useAdminNotifier();
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
      notify.validationError();
      return;
    }
    notify.createPromise(
      crearCategoria.mutateAsync(nuevoCategoriaForm.values)
        .then(() => {
          queryClient.invalidateQueries(["categoria"]);
          nuevoCategoriaForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
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
      notify.validationError(); 
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { categoriaId: editandoId, ...editCategoriaForm.values };

    notify.updatePromise(
      updateCategoria.mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editCategoriaForm.resetForm();
          queryClient.invalidateQueries(["Categoria"]);
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editCategoriaForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar un carrito con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteCategoria.mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editCategoriaForm.resetForm();
          }

          nuevoCategoriaForm.resetForm();

          queryClient.setQueryData(["categorias"], (old) =>
            old ? old.filter((u) => u.categoriaId !== id) : []
          );

          queryClient.invalidateQueries(["categorias"]);
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };


  /** Descargar registro de categorías en formato Excel */
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
        link.setAttribute("download", "categoria.xlsx");

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
