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
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useProductosAdmin = (nuevoProductoForm, editProductoForm) => {
  // ID del carrito actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelProductos();
  // Servicio centralizado de notificaciones UI
  const notify = useNotification();
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
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearProducto.mutate(nuevoProductoForm.values, {
      onSuccess: () => {
        notify.success("Producto creado correctamente");
        queryClient.invalidateQueries(["producto"]); // sincroniza la vista
        nuevoProductoForm.resetForm(); // limpia campos
      },
      onError: (error) => handleApiError(error, notify),
    });
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
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { productoId: editandoId, ...editProductoForm.values };

    updateProducto.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Producto actualizado correctamente");
        setEditandoId(null);
        editProductoForm.resetForm();
        queryClient.invalidateQueries(["producto"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editProductoForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar un carrito con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este producto?"
    );
    if (!confirmar) return;

    deleteProducto.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Producto eliminado correctamente");

          // Si el elemento eliminado estaba en edición, salir del modo edición
          if (editandoId === id) {
            setEditandoId(null);
            editProductoForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoProductoForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["productos"], (old) =>
            old ? old.filter((c) => c.productoId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["productos"]);
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
      link.setAttribute("download", "producto.xlsx"); // nombre del archivo

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
