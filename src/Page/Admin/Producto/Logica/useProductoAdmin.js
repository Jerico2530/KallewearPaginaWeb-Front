/**
 * Lógica para la administración de Productos.
 * ------------------------------------------------------------------
 * Propósito:
 *  - Centralizar el flujo completo de gestión de productos desde el panel
 *    administrativo utilizando React Query.
 *  - Mantener los componentes UI limpios separando la lógica de negocio.
 *  - Validar formularios y gestionar notificaciones profesionales.
 *
 * Funcionalidades clave:
 *  - Consultar y mantener sincronizado el listado de productos.
 *  - Crear, modificar y eliminar elementos, actualizando correctamente la UI.
 *  - Controlar el estado de edición para una experiencia más intuitiva.
 *  - Exportar datos a Excel.
 *  - Manejo correcto de errores provenientes del servidor.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useProductos,
  useCrearProducto,
  useUpdateProducto,
  useDeleteProducto,
  useExportarExcelProductos,
} from "../../../../hooks/useProducto";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useProductosAdmin = (nuevoProductoForm, editProductoForm) => {
  // ID del carrito actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelProductos();
  // Servicio centralizado de notificaciones UI
  const notify = useAdminNotifier();
  // Consulta principal de datos del carrito (caché integrada)
  const { data: productosData = [], isLoading } = useProductos();
  // Mutaciones CRUD
  const crearProducto = useCrearProducto();
  const updateProducto = useUpdateProducto();
  const deleteProducto = useDeleteProducto();
  // Ordenamiento de productos: fechaRegistro ascendente, luego por nombre
  const productos = productosData.slice().sort((a, b) => {
    const dateA = new Date(a.fechaRegistro).getTime();
    const dateB = new Date(b.fechaRegistro).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.nombre.localeCompare(b.nombre);
  });

  /** Crear producto */
  const handleCrear = async () => {
    // Evita enviar datos inválidos
    if (!(await nuevoProductoForm.validate())) {
      notify.validationError();
      return;
    }

    notify.createPromise(
      crearProducto
        .mutateAsync(nuevoProductoForm.values)
        .then(() => {
          queryClient.invalidateQueries(["producto"]);
          nuevoProductoForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error, notify);
          throw error;
        })
    );
  };

  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (producto) => {
    setEditandoId(producto.productoId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editProductoForm.setValues({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio || "",
      monedaId: producto.monedaId || "",
      generoId: producto.generoId || "",
      imagen: producto.imagen || "",
      estado: producto.estado ?? true,
    });
  };

  /** Guardar cambios de edición */
  const handleGuardar = async () => {
    if (!(await editProductoForm.validate())) {
      notify.validationError();
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { productoId: editandoId, ...editProductoForm.values };

    notify.updatePromise(
      updateProducto
        .mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editProductoForm.resetForm();
          queryClient.invalidateQueries(["producto"]);
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
    editProductoForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar un carrito con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteProducto
        .mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editProductoForm.resetForm();
          }

          nuevoProductoForm.resetForm();

          queryClient.setQueryData(["productos"], (old) =>
            old ? old.filter((r) => r.productoId !== id) : []
          );

          queryClient.invalidateQueries(["productos"]);
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
          link.setAttribute("download", "producto.xlsx");

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
    productos,
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
