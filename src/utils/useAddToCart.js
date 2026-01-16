/**
 * Hook de negocio para carrito
 * ✔ Elimina lógica del componente
 * ✔ Reutilizable en toda la app
 * ✔ Escalable para reglas futuras
 */
export const useAddToCart = ({
  carrito,
  crearCarrito,
  actualizarCarrito,
  usuarioId,
  toggleOffcanvas,
  toggleBalanceo,
}) => {
  const addToCart = async ({ producto, talla }) => {
    if (!usuarioId || !talla) return;

    const existing = carrito.find(
      (item) =>
        item.productoId === producto.productoId &&
        item.tallaId === talla.tallaId
    );

    if (existing) {
      await actualizarCarrito({
        carritoId: existing.carritoId,
        cantidad: existing.cantidad + 1,
        subTotal: (existing.cantidad + 1) * existing.precioUnitario,
      });
    } else {
      await crearCarrito({
        usuarioId,
        productoId: producto.productoId,
        tallaId: talla.tallaId, // ✅ ya NO hardcodeado
        cantidad: 1,
        precioUnitario: producto.precio,
        subTotal: producto.precio,
        estado: true,
      });
    }

    toggleOffcanvas(true);
    toggleBalanceo(true);
  };

  return { addToCart };
};
