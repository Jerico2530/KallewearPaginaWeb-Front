// hooks/useRelatedProducts.js
import { useEffect, useState } from "react";

const seleccionarProductosAleatorios = (productos, cantidad, excludeId) =>
  productos
    .filter((p) => p.productoId !== excludeId)
    .sort(() => 0.5 - Math.random())
    .slice(0, cantidad);

export const useRelatedProducts = (allProducts, productId) => {
  const [productosTop, setProductosTop] = useState([]);

  useEffect(() => {
    if (!allProducts || !productId) return;

    const update = () =>
      setProductosTop(
        seleccionarProductosAleatorios(allProducts, 6, productId)
      );

    update();
    const interval = setInterval(update, 10000);

    return () => clearInterval(interval);
  }, [allProducts, productId]);

  return productosTop;
};
