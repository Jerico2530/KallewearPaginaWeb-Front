/**
 * sincronizarCarritoGuestConUsuario.js
 *
 * Descripción del proyecto:
 * Función utilitaria para la plataforma Kallewear que permite sincronizar
 * el carrito local de un usuario invitado con su carrito real en la API
 * una vez que se autentica o registra.
 *
 * Funcionalidades clave:
 * 1. Recorre los productos del carrito local del invitado y los agrega al carrito del usuario en la API.
 * 2. Vacía el carrito local del invitado después de la sincronización para evitar duplicados.
 * 3. Maneja errores durante la sincronización e informa en consola.
 *
 * Propósito:
 * Garantizar una transición fluida entre la experiencia de usuario invitado y logeado,
 * manteniendo los productos seleccionados previamente sin pérdida de información.
 */
import useCarritoStore from "../store/carritoStore";
import { createCarritoCompras } from "../api/Carrito";

/**
 * 🔄 Sincroniza los productos del carrito local (guest)
 * con el carrito real del usuario logeado en la API.
 */
export const sincronizarCarritoGuestConUsuario = async (usuarioId) => {
  const { productos, vaciarCarrito } = useCarritoStore.getState();

  // 🟡 Si no hay productos locales, no hacemos nada
  if (!productos || productos.length === 0) return;

  try {
    // 🔹 Envía cada producto a la API del carrito real
    for (const producto of productos) {
      await createCarritoCompras({
        usuarioId: usuarioId,
        productoTallaId: producto.productoTallaId, // ajusta según tu modelo
        cantidad: producto.cantidad,
        precioUnitario: producto.precioUnitario,
      });
    }

    // 🔹 Limpia el carrito local del invitado
    vaciarCarrito();

    console.log("✅ Carrito local sincronizado con el usuario logeado");
  } catch (error) {
    console.error("❌ Error al sincronizar carrito:", error);
  }
};
