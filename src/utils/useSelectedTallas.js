import { useReducer } from "react";

const selectedTallasReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_TALLA": {
      const { productoId, talla } = action.payload;
      if (!talla) return state;

      if (state[productoId]?.tallaId === talla.tallaId) {
        const updated = { ...state };
        delete updated[productoId];
        return updated;
      }

      return { ...state, [productoId]: talla };
    }

    case "CLEAR_TALLA": {
      const updated = { ...state };
      delete updated[action.payload.productoId];
      return updated;
    }

    case "CLEAR_ALL":
      return {}; // 🔥 CLAVE POST-PAGO

    default:
      return state;
  }
};

export default function useSelectedTallas(initialState = {}) {
  const [selectedTallas, dispatchTallas] = useReducer(
    selectedTallasReducer,
    initialState
  );

  return { selectedTallas, dispatchTallas };
}
