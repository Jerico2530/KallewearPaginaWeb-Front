import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDescuentos,
  useCreateDescuento,
  useUpdateDescuento,
  useDeleteDescuento,
} from "../../../../hooks/useDescuento";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useDescuentoAdmin = (nuevoDescuentoForm, editDescuentoForm) => {
  const [editandoId, setEditandoId] = useState(null);
  const queryClient = useQueryClient();
  const notify = useAdminNotifier();

  const { data: descuentos = [], isLoading } = useDescuentos();
  const crearDescuento = useCreateDescuento();
  const updateDescuento = useUpdateDescuento();
  const deleteDescuento = useDeleteDescuento();

  /** Crear Descuento */
  const handleCrear = async () => {
    if (!(await nuevoDescuentoForm.validate())) {
      notify.validationError();
      return;
    }
    notify.createPromise(
      crearDescuento.mutateAsync(nuevoDescuentoForm.values)
        .then(() => {
          queryClient.invalidateQueries(["descuento"]);
          nuevoDescuentoForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };


  /** Editar Descuento */
  const handleEditar = (descuento) => {
    setEditandoId(descuento.descuentoId);
    editDescuentoForm.setValues({
      nombreDescuento: descuento.nombreDescuento || "",
      descripcion: descuento.descripcion || "",
      porcentaje: descuento.porcentaje || "",
      imagen: descuento.imagen || "",
      fechaInicio: descuento.fechaInicio?.substring(0, 10) || "",
      fechaFin: descuento.fechaInicio?.substring(0, 10) || "",
      estado: descuento.estado ?? true,
    });
  };

  /** Guardar cambios */
  const handleGuardar = async () => {
    if (!(await editDescuentoForm.validate())) {
      notify.validationError(); 
      return;
    }

    const dataEditar = { descuentoId: editandoId, ...editDescuentoForm.values };

    notify.updatePromise(
      updateDescuento.mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editDescuentoForm.resetForm();
          queryClient.invalidateQueries(["Descuento"]);
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };


  /** Cancelar edición */
  const handleCancelar = () => {
    setEditandoId(null);
    editDescuentoForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar Descuento */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

     notify.deletePromise(
      deleteDescuento.mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editDescuentoForm.resetForm();
          }

          nuevoDescuentoForm.resetForm();

          queryClient.setQueryData(["descuentos"], (old) =>
            old ? old.filter((u) => u.descuentoId !== id) : []
          );

          queryClient.invalidateQueries(["descuentos"]);
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  return {
    descuentos,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
  };
};
