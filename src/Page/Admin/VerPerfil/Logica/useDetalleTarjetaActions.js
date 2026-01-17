import { generarPatchOps } from "../helpers/patchHelper";

export const useDetalleTarjetaActions = (notify, crearDetalleTarjeta, patchDetalleTarjeta) => {
  const crear = async (data) => {
    const promise = crearDetalleTarjeta.mutateAsync(data);
    return await notify.createPromise(promise);
  };

  const patch = (tarjetaSeleccionada, form) => {
    const formParaPatch = {
      numeroTarjeta: form.numeroTarjeta,
      fechaVencimiento: form.fechaVencimiento,
      cvv: form.cvv,
      estado: form.estado ? 1 : 0,
    };

    const patchOps = generarPatchOps(tarjetaSeleccionada, formParaPatch);

    if (!patchOps.length) return null;

    return patchDetalleTarjeta.mutateAsync({
      id: tarjetaSeleccionada.detalleTarjetaId,
      patchOps,
    });
  };

  return { crear, patch };
};
