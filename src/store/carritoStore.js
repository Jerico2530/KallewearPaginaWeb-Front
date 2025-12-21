// carritoStore.js
import { create } from "zustand";
// ✅ Importamos 'create' de Zustand para crear un store global/local

/**
 * 🔹 Estado local del carrito (opcional)
 * Puedes usarlo para mantener productos seleccionados antes de confirmar con API.
 */
const useCarritoStore = create((set) => ({
  // ✅ Creamos el store llamado useCarritoStore
  // 'set' es la función que permite actualizar el estado

  productos: [], 
  // ✅ Estado inicial: array vacío que contendrá los productos del carrito

  agregarProducto: (producto) =>
    // ✅ Función para agregar un producto al carrito
    set((state) => {
      const existe = state.productos.find((p) => p.id === producto.id);
      // 🔹 Revisa si el producto ya existe en el carrito

      if (existe) {
        return {
          productos: state.productos.map((p) =>
            p.id === producto.id
              ? { ...p, cantidad: p.cantidad + producto.cantidad }
              // 🔹 Si existe, actualiza la cantidad sumando la nueva
              : p
          ),
        };
      }

      return { productos: [...state.productos, producto] };
      // 🔹 Si no existe, agrega el nuevo producto al array
    }),

  eliminarProducto: (id) =>
    // ✅ Función para eliminar un producto por su ID
    set((state) => ({
      productos: state.productos.filter((p) => p.id !== id),
      // 🔹 Filtra todos los productos que NO coincidan con el ID
    })),

  vaciarCarrito: () => set({ productos: [] }),
  // ✅ Función para vaciar el carrito, reseteando productos a array vacío
}));

export default useCarritoStore;
// ✅ Exportamos el hook para usarlo en cualquier componente
