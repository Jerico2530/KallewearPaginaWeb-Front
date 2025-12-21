/**
 * Lógica para la administración de Direcciones.
 *
 * Propósito:
 *  - Gestionar todo el flujo del CRUD de direcciones desde el panel administrativo.
 *  - Centralizar la lógica de negocio evitando sobrecargar los componentes UI.
 *  - Integrar validaciones, estado de edición y control de caché mediante React Query.
 *
 * Funcionalidades clave:
 *  - Obtener y ordenar direcciones con sincronización automática desde el servidor.
 *  - Validar información antes de crear o modificar registros.
 *  - Confirmar y limpiar estado durante la eliminación.
 *  - Exportar datos como archivo Excel generado por la API.
 *  - Enviar notificaciones coherentes según las acciones del usuario.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDirecciones,
  useCrearDirecciones,
  useActualizarDirecciones,
  useEliminarDirecciones,
  useExportarDirecciones,
} from "../../../../hooks/useDireccion";
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useDireccionAdmin = (nuevoDireccionForm, editDireccionForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarDirecciones();
  // Servicio global de notificaciones
  const notify = useNotification();
  // Consulta principal: obtiene todos los anuncios desde la API
  const { data: direccionesData = [], isLoading } = useDirecciones();
  // Mutaciones CRUD
  const crearDireccion = useCrearDirecciones();
  const updateDireccion = useActualizarDirecciones();
  const deleteDireccion = useEliminarDirecciones();

  /**
   * Ordenamiento por fecha y nombre del local,
   * manteniendo consistencia en la presentación de datos.
   */
  const Direcciones = direccionesData.slice().sort((a, b) => {
    const dateA = new Date(a.fechaRegistro).getTime();
    const dateB = new Date(b.fechaRegistro).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.locales.localeCompare(b.locales);
  });

  /** Crear un nuevo registro en direccion*/
  const handleCrear = async () => {
    // Evita enviar datos inválidos
    if (!(await nuevoDireccionForm.validate())) {
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearDireccion.mutate(nuevoDireccionForm.values, {
      onSuccess: () => {
        notify.success("Direccion creado correctamente");
        queryClient.invalidateQueries(["direcciones"]);
        nuevoDireccionForm.resetForm();
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

   /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (direccion) => {
    setEditandoId(direccion.direccionId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editDireccionForm.setValues({
      usuarioId: direccion.usuarioId || "",
      departamento: direccion.departamento || "",
      provincia: direccion.provincia || "",
      distrito: direccion.distrito || "",
      via: direccion.via || "",
      numero: direccion.numero || "",
      estado: direccion.estado ?? true,
    });
  };

  /** Guardar cambios de edición */
  const handleGuardar = async () => {
    if (!(await editDireccionForm.validate())) {
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { direccionId: editandoId, ...editDireccionForm.values };

    updateDireccion.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Direccion actualizado correctamente");
        setEditandoId(null);
        editDireccionForm.resetForm();
        queryClient.invalidateQueries(["direcciones"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editDireccionForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar un direccion con confirmación del usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este direccion?"
    );
    if (!confirmar) return;

    deleteDireccion.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Direccion eliminado correctamente");

          // Si el elemento eliminado estaba en edición, salir del modo edición
          if (editandoId === id) {
            setEditandoId(null);
            editDireccionForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoDireccionForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["direcciones"], (old) =>
            old ? old.filter((c) => c.direccionId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["direcciones"]);
        }
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Descargar Excel */
  const descargarExcel = async () => {
    try {
      const response = await exportarExcel.mutateAsync();

      // Crear el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un link temporal
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "direccion.xlsx"); // nombre del archivo

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
    Direcciones,
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
