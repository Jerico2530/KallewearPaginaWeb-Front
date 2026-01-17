/**
 * Genera patchOps comparando objetos dinámicamente
 * @param {object} original - Objeto original
 * @param {object} actualizado - Objeto con los nuevos valores
 * @param {string[]} campos - Lista opcional de campos a considerar (si no, toma todos)
 * @returns {Array} patchOps
 */
export const generarPatchOps = (original, actualizado, campos) => {
  const patchOps = [];

  const keys = campos || Object.keys(actualizado);

  keys.forEach((key) => {
    if (actualizado[key] !== original[key]) {
      patchOps.push({
        op: "replace",
        path: `/${key}`,
        value: actualizado[key],
      });
    }
  });

  return patchOps;
};
