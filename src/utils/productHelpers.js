export function groupProducts(productoTallas) {
  if (!productoTallas) return [];
  const map = new Map();

  productoTallas.forEach(item => {
    if (!map.has(item.productoId)) {
      map.set(item.productoId, {
        ...item,
        availableSizes: [item.tipoTalla],
        tallasDetalle: [{ ...item }],
      });
    } else {
      const existing = map.get(item.productoId);
      if (!existing.availableSizes.includes(item.tipoTalla)) existing.availableSizes.push(item.tipoTalla);
      if (!existing.tallasDetalle.some(t => t.tallaId === item.tallaId)) existing.tallasDetalle.push({ ...item });
    }
  });

  return Array.from(map.values());
}
