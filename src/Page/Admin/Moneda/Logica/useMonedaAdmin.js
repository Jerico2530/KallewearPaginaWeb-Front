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
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useMonedasAdmin = (nuevoMonedaForm, editMonedaForm) => {
  // ID del elemento que se está editando (control de modo edición en la UI)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: control sobre caché y sincronización
  const queryClient = useQueryClient();
  // Mutación para exportar datos
  const exportarExcel = useExportarExcelMonedas();
  // Servicio global de notificaciones
  const notify = useAdminNotifier();
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
      notify.validationError();
      return;
    }
    notify.createPromise(
      crearMoneda.mutateAsync(nuevoMonedaForm.values)
        .then(() => {
          queryClient.invalidateQueries(["moneda"]);
          nuevoMonedaForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
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
      notify.validationError(); 
      return;
    }

    const dataEditar = { monedaId: editandoId, ...editMonedaForm.values };

    notify.updatePromise(
      updateMoneda.mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editMonedaForm.resetForm();
          queryClient.invalidateQueries(["moneda"]);
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  /** Cancelar modo edición sin guardar cambios */
  const handleCancelar = () => {
    setEditandoId(null);
    editMonedaForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar moneda con confirmación de usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

     notify.deletePromise(
      deleteMoneda.mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editMonedaForm.resetForm();
          }

          nuevoMonedaForm.resetForm();

          queryClient.setQueryData(["monedas"], (old) =>
            old ? old.filter((u) => u.monedaId !== id) : []
          );

          queryClient.invalidateQueries(["monedas"]);
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };


  /** Exportar la lista de moneda en un archivo Excel */
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
        link.setAttribute("download", "moneda.xlsx");

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
