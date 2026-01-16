// hooks/useProductSelection.js
import { useState, useCallback } from "react";

export const useProductSelection = () => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const selectSize = useCallback((size) => {
    setSelectedSize(size);
  }, []);

  const increaseQty = useCallback(() => {
    setQuantity((q) => q + 1);
  }, []);

  const decreaseQty = useCallback(() => {
    setQuantity((q) => Math.max(1, q - 1));
  }, []);

  const reset = useCallback(() => {
    setSelectedSize(null);
    setQuantity(1);
  }, []);

  return {
    selectedSize,
    quantity,
    selectSize,
    increaseQty,
    decreaseQty,
    setQuantity,
    reset,
  };
};
