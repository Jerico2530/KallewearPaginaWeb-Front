import { useCallback } from "react";

export default function ({ crearCarrito, usuarioId, dispatchTallas, showCartFeedback }) {
  
  const handleAddToCart = useCallback(
    async (product, tallaSeleccionada) => {
      if (!tallaSeleccionada) return;

      try {
        // Usamos mutateAsync para esperar la respuesta
        await crearCarrito.mutateAsync({
          usuarioId,
          productoTallaId: tallaSeleccionada.productoTallaId,
          cantidad: 1,
          precioUnitario: product.precio,
          subTotal: product.precio,
          estado: true,
        });

        // ✅ Limpiar la talla seleccionada para este producto
        dispatchTallas({ type: "CLEAR_TALLA", payload: { productoId: product.productoId } });

        // ✅ Feedback dinámico (solo si es función)
        if (typeof showCartFeedback === "function") {
          showCartFeedback(true);
        }

      } catch (error) {
        console.error("Error al agregar al carrito:", error);
        // Podrías usar un toast o snackbar en proyectos grandes
        // alert("Error al agregar al carrito"); // Opcional
      }
    },
    [crearCarrito, usuarioId, dispatchTallas, showCartFeedback]
  );

  return { handleAddToCart };
}
