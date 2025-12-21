/**
 * Lógica para la administración de Órdenes.
 * ------------------------------------------------------------------
 * Propósito:
 *  - Centralizar el flujo completo de gestión de órdenes desde el panel
 *    administrativo utilizando React Query.
 *  - Mantener los componentes UI limpios separando la lógica de negocio.
 *  - Validar formularios y gestionar notificaciones profesionales.
 *
 * Funcionalidades clave:
 *  - Consultar y mantener sincronizado el listado de órdenes.
 *  - Crear, modificar y eliminar órdenes, actualizando correctamente la UI.
 *  - Controlar el estado de edición para una experiencia más intuitiva.
 *  - Exportación de datos a Excel.
 *  - Manejo correcto de errores provenientes del servidor.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useOrdenes,
  useCrearOrden,
  useActualizarOrden,
  useEliminarOrden,
  useExportarOrdenes,
} from "../../../../hooks/useOrden";
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useOrdenesAdmin = (nuevoOrdenForm, editOrdenForm) => {
  // ID del carrito actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarOrdenes();
  // Servicio centralizado de notificaciones UI
  const notify = useNotification();
  // Consulta principal de datos del carrito (caché integrada)
  const { data: ordenes, isLoading } = useOrdenes();
  // Mutaciones CRUD
  const crearOrden = useCrearOrden();
  const updateOrden = useActualizarOrden();
  const deleteOrden = useEliminarOrden();

  /** Crear un nuevo registro en orden */
  const handleCrear = async () => {
    // Evita enviar datos inválidos
    if (!(await nuevoOrdenForm.validate())) {
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearOrden.mutate(nuevoOrdenForm.values, {
      onSuccess: () => {
        notify.success("Orden creado correctamente");
        queryClient.invalidateQueries(["orden"]);
        nuevoOrdenForm.resetForm();
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (orden) => {
    setEditandoId(orden.ordenId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editOrdenForm.setValues({
      usuarioId: orden.usuarioId || "",
      sucursalId: orden.sucursalId || "",
      metodoEntrega: orden.metodoEntrega || "",
      direccionId: orden.direccionId || "",
      estado: orden.estado ?? true,
    });
  };

  /** Guardar cambios de edición */
  const handleGuardar = async () => {
    if (!(await editOrdenForm.validate())) {
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { ordenId: editandoId, ...editOrdenForm.values };

    updateOrden.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Orden actualizado correctamente");
        setEditandoId(null);
        editOrdenForm.resetForm();
        queryClient.invalidateQueries(["orden"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editOrdenForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar un carrito con confirmación del orden */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este orden?"
    );
    if (!confirmar) return;

    deleteOrden.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Orden eliminado correctamente");

          // 🧩 Limpieza inmediata del form y cache coherente
          if (editandoId === id) {
            setEditandoId(null);
            editOrdenForm.resetForm();
          }

          nuevoOrdenForm.resetForm();

          queryClient.setQueryData(["ordenes"], (old) =>
            old ? old.filter((c) => c.ordenId !== id) : []
          );

          queryClient.invalidateQueries(["ordenes"]);
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
      link.setAttribute("download", "orden.xlsx"); // nombre del archivo

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
    ordenes,
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
