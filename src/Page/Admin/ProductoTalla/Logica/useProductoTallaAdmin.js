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
import { useNotification } from "../../../../utils/NotificationService";
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
  const notify = useNotification();
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
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearProductoTalla.mutate(nuevoProductoTallaForm.values, {
      onSuccess: () => {
        notify.success("ProductoTalla creado correctamente");
        queryClient.invalidateQueries(["ProductoTalla"]); // sincroniza la vista
        nuevoProductoTallaForm.resetForm(); // limpia campos
      },
      onError: (error) => handleApiError(error, notify),
    });
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
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }

    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = {
      productoTallaId: editandoId,
      ...editProductoTallaForm.values,
    };

    updateProductoTalla.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("ProductoTalla actualizado correctamente");
        setEditandoId(null);
        editProductoTallaForm.resetForm();
        queryClient.invalidateQueries(["ProductoTalla"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editProductoTallaForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar ProductoTalla */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este ProductoTalla?"
    );
    if (!confirmar) return;
    deleteProductoTalla.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso)
          notify.success("ProductoTalla eliminado correctamente");
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
      link.setAttribute("download", "productoTalla.xlsx"); // nombre del archivo

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
