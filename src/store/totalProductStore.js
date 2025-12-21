/**
 * useTotalStore.js
 *
 * Descripción del proyecto:
 * Este store forma parte del sistema de carrito de compras de Kallewear,
 * facilitando la gestión y cálculo de métricas de productos en el carrito de manera centralizada.
 *
 * Funcionalidades clave:
 * 1. `getTotalProducts(cart)`: calcula el número total de productos únicos en el carrito.
 *    - Filtra los productos duplicados según su `id`.
 *    - Devuelve un número entero representando la cantidad de productos distintos.
 *
 * Propósito:
 * Proveer una herramienta confiable para obtener el conteo de productos únicos,
 * optimizando la visualización y lógica de resúmenes de carrito en la interfaz de usuario.
 */
import { create } from "zustand";

const useTotalStore = create(() => ({
  // Función para calcular el total de productos únicos
  getTotalProducts: (cart) => {
    if (!cart || cart.length === 0) return 0;

    // Filtrar los productos únicos por ID
    const uniqueProducts = cart.filter(
      (product, index, self) =>
        index === self.findIndex((t) => t.id === product.id)
    );
    // Contar los productos únicos
    return uniqueProducts.length;
  },
}));

export default useTotalStore;
