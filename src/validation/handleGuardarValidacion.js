import { validate } from "yup"; // ya tienes Yup importado

const handleGuardar = async () => {
  try {
    // Validamos ambos esquemas juntos
    await InfoTarjetaValidacion.validate(
      { medioPagoId: form.medioPagoId }
    , { abortEarly: false });

    await DetalleTarjetaValidacion.validate(
      {
        numeroTarjeta: form.numeroTarjeta,
        fechaVencimiento: form.fechaVencimiento,
        cvv: form.cvv,
      },
      { abortEarly: false }
    );

    // Si llega aquí, todo es válido
    await onSubmit(form); // Guardamos
    // Modal se puede cerrar si onSubmit no lanza error
  } catch (yupError) {
    if (yupError.inner) {
      // yupError.inner contiene todos los errores
      const nuevosErrores = {};
      yupError.inner.forEach((err) => {
        if (err.path) nuevosErrores[err.path] = err.message;
      });
      // Actualizamos el estado de errores para resaltar inputs
      // Esto bloquea el cierre del modal
      console.log("Errores de validación:", nuevosErrores);
      // Aquí debes actualizar el estado de errores que tu modal usa
      // Por ejemplo, si errores viene como prop desde padre, podrías pasar un setter:
      // setErrores(nuevosErrores)
    }
  }
};
