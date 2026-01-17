import { generarPatchOps } from "../helpers/patchHelper";

export const useInfoTarjetaActions = (notify, patchInfoTarjeta, eliminarInfoTarjeta, crearInfoTarjeta) => {
  const crear = async (data) => {
    const promise = crearInfoTarjeta.mutateAsync(data);
    return await notify.createPromise(promise);
  };

  const eliminar = async (id) => {
    const confirm = await notify.confirmDelete();
    if (!confirm) return;
    const promise = eliminarInfoTarjeta.mutateAsync(id);
    return await notify.deletePromise(promise);
  };

  const patch = (tarjetaSeleccionada, form) => {
    const formParaPatch = {
      medioPagoId: Number(form.medioPagoId),
      estado: form.estado ? 1 : 0,
    };

    const patchOps = generarPatchOps(tarjetaSeleccionada, formParaPatch);

    if (!patchOps.length) return null;

    return patchInfoTarjeta.mutateAsync({
      id: tarjetaSeleccionada.infoTarjetaId,
      patchOps,
    });
  };

  return { crear, eliminar, patch };
};
