/**
 * Lógica para la administración de Sucursales
 * ------------------------------------------------------------------
 * Propósito:
 *  - Gestionar todo el flujo de CRUD de Sucursales usando React Query.
 *  - Centralizar la lógica de creación, edición, eliminación y exportación de datos.
 *  - Mantener componentes más limpios y separados de la lógica de negocio.
 *
 * Funcionalidades clave:
 *  - Obtener lista de sucursales con caché y sincronización automática.
 *  - Validar formularios antes de guardar o actualizar información.
 *  - Controlar estados de edición UI (modo edición activo/inactivo).
 *  - Notificaciones profesionales de éxito/error.
 *  - Exportar datos como archivo Excel generado por la API.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useSucursales,
  useCreateSucursal,
  useUpdateSucursal,
  useDeleteSucursal,
  useExportarExcelSucursales,
} from "../../../../hooks/useSucursal";
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useSucursalAdmin = (nuevoSucursalForm, editSucursalForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelSucursales();
  // Servicio global de notificaciones
  const notify = useNotification();
  // Consulta principal: obtiene todos los anuncios desde la API
  const { data: sucursalsData = [], isLoading } = useSucursales();
  // Mutaciones CRUD
  const crearSucursal = useCreateSucursal();
  const updateSucursal = useUpdateSucursal();
  const deleteSucursal = useDeleteSucursal();

  // Lista ordenada de sucursales (por fecha y nombre)
  const Sucursales = sucursalsData.slice().sort((a, b) => {
    const dateA = new Date(a.fechaRegistro).getTime();
    const dateB = new Date(b.fechaRegistro).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.locales.localeCompare(b.locales);
  });

  /** Crear sucursal */
  const handleCrear = async () => {
    // Evita enviar datos inválidos a la API
    if (!(await nuevoSucursalForm.validate())) {
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearSucursal.mutate(nuevoSucursalForm.values, {
      onSuccess: () => {
        notify.success("Sucursal creado correctamente");
        queryClient.invalidateQueries(["sucursales"]);
        nuevoSucursalForm.resetForm();
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Inicia edición cargando datos existentes en el formulario */
  const handleEditar = (sucursal) => {
    setEditandoId(sucursal.sucursalId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editSucursalForm.setValues({
      locales: sucursal.locales || "",
      descripcion: sucursal.descripcion || "",
      estado: sucursal.estado ?? true,
    });
  };

  /** Guardar cambios */
  const handleGuardar = async () => {
    if (!(await editSucursalForm.validate())) {
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { sucursalId: editandoId, ...editSucursalForm.values };

    updateSucursal.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Sucursal actualizado correctamente");
        setEditandoId(null);
        editSucursalForm.resetForm();
        queryClient.invalidateQueries(["sucursales"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar modo edición sin guardar cambios */
  const handleCancelar = () => {
    setEditandoId(null);
    editSucursalForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar sucursal con confirmación de usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este sucursal?"
    );
    if (!confirmar) return;

    deleteSucursal.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Sucursal eliminado correctamente");

          // Si el anuncio eliminado estaba siendo editado, reiniciar estado
          if (editandoId === id) {
            setEditandoId(null);
            editSucursalForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoSucursalForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["sucursales"], (old) =>
            old ? old.filter((c) => c.sucursalId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["sucursales"]);
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
      link.setAttribute("download", "sucursal.xlsx"); // nombre del archivo

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
    Sucursales,
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
