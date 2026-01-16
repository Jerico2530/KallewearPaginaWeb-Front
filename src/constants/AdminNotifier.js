import { useNotifier } from "../utils/useNotifier";

export const useAdminNotifier = () => {
  const notify = useNotifier();

  return {
    created: () => notify.success("Registro creado correctamente"),
    updated: () => notify.success("Registro actualizado correctamente"),
    deleted: () => notify.success("Registro eliminado correctamente"),
    cancelled: () => notify.info("Edición cancelada"),


    validationError: () => notify.warning("Corrige los errores del formulario"),

    createPromise: (promise) =>
      notify.promise(promise, {
        loading: "Creando registro...",
        success: "Registro creado correctamente",
        error: "Error al crear el registro",
      }),

    updatePromise: (promise) =>
      notify.promise(promise, {
        loading: "Guardando cambios...",
        success: "Registro actualizado correctamente",
        error: "Error al actualizar el registro",
      }),

    deletePromise: (promise) =>
      notify.promise(promise, {
        loading: "Eliminando registro...",
        success: "Registro eliminado correctamente",
        error: "Error al eliminar el registro",
      }),
    confirmDelete: () =>
      notify.confirmAsync({
        message: "¿Seguro que deseas eliminar este registro?",
        variant: "danger",
        confirmText: "Eliminar",
      }),

    exportPromise: (promise) =>
      notify.promise(promise, {
        loading: "Generando archivo Excel...",
        success: "Excel descargado correctamente",
        error: "No se pudo generar el archivo Excel",
      }),
  };
};
