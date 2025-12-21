import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {useDescuentos,useCreateDescuento,useUpdateDescuento,useDeleteDescuento,} from "../../../../hooks/useDescuento";
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useDescuentoAdmin = (nuevoDescuentoForm, editDescuentoForm) => {
  const [editandoId, setEditandoId] = useState(null);
  const queryClient = useQueryClient();
  const notify = useNotification();

  const { data: descuentos = [], isLoading } = useDescuentos();
  const crearDescuento = useCreateDescuento();
  const updateDescuento = useUpdateDescuento();
  const deleteDescuento = useDeleteDescuento();

  /** Crear Descuento */
  const handleCrear = async () => {
    if (!(await nuevoDescuentoForm.validate())) {
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }

    crearDescuento.mutate(nuevoDescuentoForm.values, {
      onSuccess: () => {
        notify.success("Descuento creado correctamente");
        queryClient.invalidateQueries(["descuento"]);
        nuevoDescuentoForm.resetForm();
      },
      onError: (error) => handleApiError(error, notify),
    });
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
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }

    const dataEditar = { descuentoId: editandoId, ...editDescuentoForm.values };

    updateDescuento.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Descuento actualizado correctamente");
        setEditandoId(null);
        editDescuentoForm.resetForm();
        queryClient.invalidateQueries(["Descuento"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar edición */
  const handleCancelar = () => {
    setEditandoId(null);
    editDescuentoForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar Descuento */
const handleEliminar = async (id) => {
  const confirmar = await notify.confirmAsync("¿Seguro que deseas eliminar esta categoría?");
  if (!confirmar) return;

  deleteDescuento.mutate(id, {
    onSuccess: (data) => {
      if (data?.isExitoso) {
        notify.success("Categoría eliminada correctamente");

        // 🧩 Limpieza inmediata del form y cache coherente
        if (editandoId === id) {
          setEditandoId(null);
          editDescuentoForm.resetForm();
        }

        nuevoDescuentoForm.resetForm();

        // 🧠 Mantener coherencia con cache (clave correcta)
        queryClient.setQueryData(["descuentos"], (old) =>
          old ? old.filter((c) => c.descuentoId !== id) : []
        );

        // Refetch silencioso para asegurar estado real del backend
        queryClient.invalidateQueries(["descuentos"]);
      }
    },
    onError: (error) => handleApiError(error, notify),
  });
};


  return {descuentos,isLoading,editandoId,handleCrear,handleEditar,handleGuardar,handleCancelar,handleEliminar,};
};
