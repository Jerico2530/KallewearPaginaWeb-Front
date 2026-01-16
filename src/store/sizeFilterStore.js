/**
 * useSizeFilterStore.js
 *
 * Descripción del proyecto:
 * Este store centraliza la gestión de filtros por talla en la tienda online Kallewear,
 * permitiendo que la selección de tallas se aplique de manera consistente en toda la interfaz de usuario.
 *
 * Funcionalidades clave:
 * 1. `selectedSizes`: array que almacena las tallas actualmente seleccionadas por el usuario.
 * 2. `setSelectedSizes`: setter directo para actualizar las tallas seleccionadas.
 * 3. `handleFilter`: función que maneja la lógica del filtro, actualiza las tallas y permite finalizar
 *    animaciones o barras de carga asociadas al filtrado.
 *
 * Propósito:
 * Proporcionar un mecanismo centralizado y eficiente para controlar la selección de tallas,
 * optimizando la experiencia de navegación y filtrado de productos.
 */
import { create } from "zustand";

const useSizeFilterStore = create((set) => ({
  selectedSizes: [], // Estado inicial de las tallas seleccionadas

  // Actualizar las tallas seleccionadas
  setSelectedSizes: (newSizes) => set({ selectedSizes: newSizes }),

  // Manejar el filtro (puedes agregar lógica adicional aquí)
  handleFilter: (newSizes, ref) => {
    set({ selectedSizes: newSizes }); // Actualiza las tallas seleccionadas

    // Finaliza la barra de carga con un pequeño retardo
    if (ref?.current) {
      setTimeout(() => {ref.current.complete();}, 50);
    }
  },
}));

export default useSizeFilterStore;
