export const formatDate = (date, locale = "es-PE") => {
  if (!date) return null;

  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
