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
import { useNotification } from "../../../../utils/NotificationService";
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
  const notify = useNotification();
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
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearProductoCategoria.mutate(nuevoProductoCategoriaForm.values, {
      onSuccess: () => {
        notify.success("ProductoCategoria creado correctamente");
        queryClient.invalidateQueries(["productoCategoria"]); // sincroniza la vista
        nuevoProductoCategoriaForm.resetForm(); // limpia campos
      },
      onError: (error) => handleApiError(error, notify),
    });
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
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = {
      productoCategoriaId: editandoId,
      ...editProductoCategoriaForm.values,
    };

    updateProductoCategoria.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("ProductoCategoria actualizado correctamente");
        setEditandoId(null);
        editProductoCategoriaForm.resetForm();
        queryClient.invalidateQueries(["productoCategoria"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editProductoCategoriaForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar un carrito con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este productoCategoria?"
    );
    if (!confirmar) return;

    deleteProductoCategoria.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("ProductoCategoria eliminado correctamente");
          // Si el elemento eliminado estaba en edición, salir del modo edición
          if (editandoId === id) {
            setEditandoId(null);
            editProductoCategoriaForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoProductoCategoriaForm.resetForm();

          queryClient.setQueryData(["productoCategorias"], (old) =>
            old ? old.filter((c) => c.productoCategoriaId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["productoCategorias"]);
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
      link.setAttribute("download", "productoCategoria.xlsx"); // nombre del archivo

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
