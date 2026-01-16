/**
 * Hook reutilizable para selección aleatoria eficiente
 * ✔ Evita sort(Math.random)
 * ✔ Escalable para listas grandes
 */
export const getRandomItems = (items = [], count = 6) => {
  const result = [...items];
  let currentIndex = result.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [result[currentIndex], result[randomIndex]] = [
      result[randomIndex],
      result[currentIndex],
    ];
  }

  return result.slice(0, count);
};
