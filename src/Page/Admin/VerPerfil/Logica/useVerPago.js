import { useState, useMemo } from "react";
import useUserStore from "../../../../store/userStore";
import {
  useInfoTarjetasByUsuario,
  useCrearInfoTarjeta,
  useEliminarInfoTarjeta,
  usePatchInfoTarjeta,
} from "../../../../hooks/useInfoTarjeta";
import { useCreateDetalleTarjeta, usePatchDetalleTarjeta } from "../../../../hooks/useDetalleTarjeta";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { DetalleTarjetaValidacion } from "../../../../validation/DetalleTarjetaValidacion";
import { InfoTarjetaValidacion } from "../../../../validation/InfoTarjetaValidacion";

import { useInfoTarjetaActions } from "./useInfoTarjetaActions";
import { useDetalleTarjetaActions } from "./useDetalleTarjetaActions";

export const useVerPago = () => {
  const { usuarioId, nombreCompleto, apellidoCompleto, imagen } = useUserStore();
  const user = { nombreCompleto, apellidoCompleto, imagen };
  const notify = useAdminNotifier();

  const [openModal, setOpenModal] = useState(false);
  const [modo, setModo] = useState("crear");
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);
  const [errores, setErrores] = useState({});

  const { data: infoTarjetas = [], isLoading, isError } = useInfoTarjetasByUsuario(usuarioId);

  /* ================= HOOKS DE MUTACIÓN ================= */
  const patchInfoHook = usePatchInfoTarjeta();
  const eliminarInfoHook = useEliminarInfoTarjeta();
  const crearInfoHook = useCrearInfoTarjeta();
  const patchDetalleHook = usePatchDetalleTarjeta();
  const crearDetalleHook = useCreateDetalleTarjeta();

  const infoActions = useMemo(
    () => useInfoTarjetaActions(notify, patchInfoHook, eliminarInfoHook, crearInfoHook),
    [notify, patchInfoHook, eliminarInfoHook, crearInfoHook]
  );

  const detalleActions = useMemo(
    () => useDetalleTarjetaActions(notify, crearDetalleHook, patchDetalleHook),
    [notify, crearDetalleHook, patchDetalleHook]
  );

  /* ================= MODAL ================= */
  const abrirCrear = () => {
    setModo("crear");
    setTarjetaSeleccionada(null);
    setErrores({});
    setOpenModal(true);
  };

  const abrirEditar = (tarjeta) => {
    setModo("editar");
    setTarjetaSeleccionada(tarjeta);
    setErrores({});
    setOpenModal(true);
  };

  const cerrarModal = () => setOpenModal(false);

  /* ================= ELIMINAR ================= */
  const eliminar = async (id) => {
    try {
      await infoActions.eliminar(id);
    } catch {
      notify.validationError();
    }
  };

  /* ================= VALIDACIÓN ================= */
  const validarForm = async (form) => {
    await DetalleTarjetaValidacion.validate(form, { abortEarly: false });
    await InfoTarjetaValidacion.validate({ medioPagoId: form.medioPagoId, detalleTarjetaId: 1 });
  };

  /* ================= CREAR TARJETA ================= */
  const handleCrearTarjeta = async (form) => {
    const detalle = await detalleActions.crear({
      numeroTarjeta: form.numeroTarjeta,
      fechaVencimiento: form.fechaVencimiento,
      cvv: form.cvv,
      estado: form.estado ? 1 : 0,
    });

    await infoActions.crear({
      usuarioId,
      medioPagoId: Number(form.medioPagoId),
      detalleTarjetaId: detalle.detalleTarjetaId,
      estado: form.estado ? 1 : 0,
    });

    cerrarModal();
  };

  /* ================= EDITAR TARJETA (una sola notificación) ================= */
  const handleEditarTarjeta = async (form) => {
    if (!tarjetaSeleccionada) return;

    // Creamos las promesas solo si hay cambios
    const promises = [
      infoActions.patch(tarjetaSeleccionada, form),
      detalleActions.patch(tarjetaSeleccionada, form),
    ].filter(Boolean);

    if (!promises.length) {
      cerrarModal();
      return; // nada que actualizar
    }

    try {
      await notify.updatePromise(Promise.all(promises)); // 🚀 una sola notificación
      cerrarModal();
    } catch {
      notify.validationError();
    }
  };

  /* ================= SUBMIT ================= */
  const onSubmit = async (form) => {
    try {
      setErrores({});
      await validarForm(form);
      modo === "crear"
        ? await handleCrearTarjeta(form)
        : await handleEditarTarjeta(form);
    } catch (error) {
      if (error.name === "ValidationError") {
        const campos = {};
        error.inner.forEach((err) => (campos[err.path] = err.message));
        setErrores(campos);
        notify.validationError();
      } else {
        notify.validationError();
      }
    }
  };

  return {
    user,
    infoTarjetas,
    isLoading,
    isError,
    openModal,
    modo,
    tarjetaSeleccionada,
    abrirCrear,
    abrirEditar,
    eliminar,
    onSubmit,
    cerrarModal,
    errores,
  };
};
