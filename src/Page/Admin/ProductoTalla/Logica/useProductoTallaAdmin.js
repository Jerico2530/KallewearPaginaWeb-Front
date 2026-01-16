/**
 * Lógica para la administración de ProductoTallas.
 * ------------------------------------------------------------------
 * Propósito:
 *  - Centralizar el flujo completo de gestión de ProductoTallas desde el panel
 *    administrativo utilizando React Query.
 *  - Mantener los componentes UI limpios separando la lógica de negocio.
 *  - Validar formularios y gestionar notificaciones profesionales.
 *
 * Funcionalidades clave:
 *  - Consultar y mantener sincronizado el listado de ProductoTallas.
 *  - Crear, modificar y eliminar elementos, actualizando correctamente la UI.
 *  - Controlar el estado de edición para una experiencia más intuitiva.
 *  - Exportación de datos a Excel de manera confiable.
 *  - Manejo correcto de errores provenientes del servidor.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useProductoTallas,
  useCreateProductoTalla,
  useUpdateProductoTalla,
  useDeleteProductoTalla,
  useExportarExcelProductoTallas,
} from "../../../../hooks/useProductoTalla";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useProductoTallasAdmin = (
  nuevoProductoTallaForm,
  editProductoTallaForm
) => {
  // ID del carrito actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelProductoTallas();
  // Servicio centralizado de notificaciones UI
  const notify = useAdminNotifier();
  // Consulta principal de datos del carrito (caché integrada)
  const { data: productoTallas = [], isLoading } = useProductoTallas();
  // Mutaciones CRUD
  const crearProductoTalla = useCreateProductoTalla();
  const updateProductoTalla = useUpdateProductoTalla();
  const deleteProductoTalla = useDeleteProductoTalla();

  /** Crear ProductoTalla */
  const handleCrear = async () => {
    // Evita enviar datos inválidos
    if (!(await nuevoProductoTallaForm.validate())) {
      notify.validationError();
      return;
    }
    notify.createPromise(
      crearProductoTalla
        .mutateAsync(nuevoProductoTallaForm.values)
        .then(() => {
          queryClient.invalidateQueries(["ProductoTalla"]);
          nuevoProductoTallaForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };
  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (productoTalla) => {
    setEditandoId(productoTalla.productoTallaId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editProductoTallaForm.setValues({
      productoId: productoTalla.productoId || "",
      productoCategoriaId: productoTalla.productoCategoriaId || "",
      tallaId: productoTalla.tallaId || "",
      stock: productoTalla.stock || "",
      estado: productoTalla.estado ?? true,
    });
  };

  /** Guardar cambios de edición */
  const handleGuardar = async () => {
    if (!(await editProductoTallaForm.validate())) {
      notify.validationError();
      return;
    }

    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = {
      productoTallaId: editandoId,
      ...editProductoTallaForm.values,
    };

     notify.updatePromise(
      updateProductoTalla.mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editProductoTallaForm.resetForm();
          queryClient.invalidateQueries(["ProductoTalla"]);
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
    editProductoTallaForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar ProductoTalla */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteProductoTalla.mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editProductoTallaForm.resetForm();
          }

          nuevoProductoTallaForm.resetForm();

          queryClient.setQueryData(["ProductoTalla"], (old) =>
            old ? old.filter((r) => r.productoTallaId !== id) : []
          );

          queryClient.invalidateQueries(["ProductoTalla"]);
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
        const url = window.URL.createObjectURL(
          new Blob([response.data])
        );

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "productoTalla.xlsx");

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
    productoTallas,
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
