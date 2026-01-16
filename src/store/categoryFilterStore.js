/**
 * categoryFilterStore.js
 *
 * Descripción del proyecto:
 * Este store gestiona el filtro de categorías en la tienda online Kallewear,
 * permitiendo a los usuarios seleccionar y alternar entre categorías de productos
 * de manera intuitiva y dinámica.
 *
 * Funcionalidades clave:
 * 1. `selectedCategories`: mantiene la categoría actualmente seleccionada.
 * 2. `setSelectedCategories`: actualiza directamente las categorías seleccionadas.
 * 3. `handleFilter`: alterna la selección de una categoría; solo una categoría puede estar activa a la vez.
 *    Además, si se pasa una referencia `ref`, completa la acción con un pequeño retraso para integrarse
 *    con componentes de interfaz que requieren finalizar procesos internos.
 *
 * Propósito:
 * Mejorar la experiencia de usuario en la navegación y filtrado de productos,
 * asegurando que la selección de categorías sea clara y eficiente.
 */
import { create } from "zustand";
// Creación del store con Zustand
const useCategoryFilterStore = create((set) => ({
  selectedCategories: [], // Estado inicial de categorías seleccionadas
  // Función para actualizar la lista de categorías seleccionadas
  setSelectedCategories: (categories) =>
    set({ selectedCategories: categories }),
  
  // Alterna la selección de una categoría
  handleFilter: (newCategories, ref) => {
    set({ selectedCategories: newCategories }); // Actualiza el array

    // Finaliza la barra de carga con un pequeño retardo
    if (ref?.current) {
      setTimeout(() => {
        ref.current.complete();
      }, 50);
    }
  },
}));

export default useCategoryFilterStore;
