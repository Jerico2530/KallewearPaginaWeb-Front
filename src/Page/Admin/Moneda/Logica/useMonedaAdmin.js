/**
 * Lógica para la administración de Monedas.
 *
 * Propósito:
 * - Centralizar toda la lógica de negocio relacionada con mantenimiento de monedas.
 * - Gestionar operaciones CRUD mediante React Query con caché optimizada.
 * - Mantener los componentes de UI limpios y sin lógica repetitiva.
 *
 * Funcionalidades clave:
 * - Obtener la lista de monedas con actualización automática de caché.
 * - Crear, editar y eliminar de forma segura y validada.
 * - Controlar el estado de edición dentro de la interfaz.
 * - Exportar la información en formato Excel desde la API.
 * - Manejo profesional de notificaciones y errores.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useMonedas,
  useCreateMoneda,
  useUpdateMoneda,
  useDeleteMoneda,
  useExportarExcelMonedas,
} from "../../../../hooks/useMoneda";
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useMonedasAdmin = (nuevoMonedaForm, editMonedaForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelMonedas();
  // Servicio global de notificaciones
  const notify = useNotification();
  // Consulta principal: obtiene todos los moneda desde la API
  const { data: monedasData = [], isLoading } = useMonedas();
  // Mutaciones CRUD
  const crearMoneda = useCreateMoneda();
  const updateMoneda = useUpdateMoneda();
  const deleteMoneda = useDeleteMoneda();

  // Ordenamiento consistente: fecha y nombre
  const monedas = monedasData.slice().sort((a, b) => {
    const dateA = new Date(a.fechaRegistro).getTime();
    const dateB = new Date(b.fechaRegistro).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.nombre.localeCompare(b.nombre);
  });

  /** Crear moneda */
  const handleCrear = async () => {
    // Evita enviar datos inválidos a la API
    if (!(await nuevoMonedaForm.validate())) {
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearMoneda.mutate(nuevoMonedaForm.values, {
      onSuccess: () => {
        notify.success("Moneda creado correctamente");
        queryClient.invalidateQueries(["moneda"]); // sincroniza lista
        nuevoMonedaForm.resetForm(); // limpia formulario
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Inicia edición cargando datos existentes en el formulario */
  const handleEditar = (moneda) => {
    setEditandoId(moneda.monedaId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editMonedaForm.setValues({
      codigo: moneda.codigo || "",
      nombre: moneda.nombre || "",
      simbolo: moneda.simbolo || "",
      estado: moneda.estado ?? true,
    });
  };

  /** Guardar cambios del moneda editado */
  const handleGuardar = async () => {
    if (!(await editMonedaForm.validate())) {
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }

    const dataEditar = { monedaId: editandoId, ...editMonedaForm.values };

    updateMoneda.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Moneda actualizado correctamente");
        setEditandoId(null);
        editMonedaForm.resetForm();
        queryClient.invalidateQueries(["moneda"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar modo edición sin guardar cambios */
  const handleCancelar = () => {
    setEditandoId(null);
    editMonedaForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar moneda con confirmación de usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este moneda?"
    );
    if (!confirmar) return;

    deleteMoneda.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Moneda eliminado correctamente");

          // Si el moneda eliminado estaba siendo editado, reiniciar estado
          if (editandoId === id) {
            setEditandoId(null);
            editMonedaForm.resetForm();
          }

          nuevoMonedaForm.resetForm();
          // Actualiza caché local inmediatamente (optimización de UX)
          queryClient.setQueryData(["monedas"], (old) =>
            old ? old.filter((c) => c.monedaId !== id) : []
          );

          queryClient.invalidateQueries(["monedas"]);
        }
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Exportar la lista de moneda en un archivo Excel */
  const descargarExcel = async () => {
    try {
      const response = await exportarExcel.mutateAsync();

      // Crear el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un link temporal
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "moneda.xlsx"); // nombre del archivo

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
    monedas,
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
