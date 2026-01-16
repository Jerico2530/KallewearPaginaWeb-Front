/**
 * Lógica para la administración de ProductoCategorias.
 * ------------------------------------------------------------------
 * Propósito:
 *   - Centralizar el flujo completo de gestión de ProductoCategorias desde el panel
 *     administrativo utilizando React Query.
 *   - Mantener los componentes UI limpios separando la lógica de negocio.
 *   - Validar formularios y gestionar notificaciones profesionales.
 *
 * Funcionalidades clave:
 *   - Consultar y mantener sincronizado el listado de ProductoCategorias.
 *   - Crear, modificar y eliminar elementos, actualizando correctamente la UI.
 *   - Controlar el estado de edición para una experiencia más intuitiva.
 *   - Manejo correcto de errores provenientes del servidor.
 *   - Exportar listado a Excel de manera confiable.
 */

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useProductoCategorias,
  useCreateProductoCategoria,
  useUpdateProductoCategoria,
  useDeleteProductoCategoria,
  useExportarExcelProductoCategorias,
} from "../../../../hooks/useProductoCategoria";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useProductoCategoriasAdmin = (
  nuevoProductoCategoriaForm,
  editProductoCategoriaForm
) => {
  // ID del carrito actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelProductoCategorias();
  // Servicio centralizado de notificaciones UI
  const notify = useAdminNotifier();
  // Consulta principal de datos del carrito (caché integrada)
  const { data: productoCategoriasData = [], isLoading } =
    useProductoCategorias();
  // Mutaciones CRUD
  const crearProductoCategoria = useCreateProductoCategoria();
  const updateProductoCategoria = useUpdateProductoCategoria();
  const deleteProductoCategoria = useDeleteProductoCategoria();
  // Ordenar lista de productos por fecha y luego por nombre
  const productoCategorias = productoCategoriasData.slice().sort((a, b) => {
    const dateA = new Date(a.fechaRegistro).getTime();
    const dateB = new Date(b.fechaRegistro).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.nombreCompleto.localeCompare(b.nombreCompleto);
  });

  /** Crear productoCategoria */
  const handleCrear = async () => {
    if (!(await nuevoProductoCategoriaForm.validate())) {
      notify.validationError();
      return;
    }
    notify.createPromise(
      crearProductoCategoria
        .mutateAsync(nuevoProductoCategoriaForm.values)
        .then(() => {
          queryClient.invalidateQueries(["productoCategoria"]);
          nuevoProductoCategoriaForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (productoCategoria) => {
    setEditandoId(productoCategoria.productoCategoriaId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editProductoCategoriaForm.setValues({
      productoId: productoCategoria.productoId || "",
      categoriaId: productoCategoria.categoriaId || "",
      estado: productoCategoria.estado ?? true,
    });
  };

  /** Guardar cambios de edición */
  const handleGuardar = async () => {
    if (!(await editProductoCategoriaForm.validate())) {
      notify.validationError();
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = {
      productoCategoriaId: editandoId,
      ...editProductoCategoriaForm.values,
    };
    notify.updatePromise(
      updateProductoCategoria
        .mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editProductoCategoriaForm.resetForm();
          queryClient.invalidateQueries(["productoCategoria"]);
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editProductoCategoriaForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar un carrito con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteProductoCategoria
        .mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editProductoCategoriaForm.resetForm();
          }

          nuevoProductoCategoriaForm.resetForm();

          queryClient.setQueryData(["productoCategorias"], (old) =>
            old ? old.filter((r) => r.productoCategoriaId !== id) : []
          );

          queryClient.invalidateQueries(["productoCategorias"]);
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
          link.setAttribute("download", "productoCategoria.xlsx");

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
    productoCategorias,
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
