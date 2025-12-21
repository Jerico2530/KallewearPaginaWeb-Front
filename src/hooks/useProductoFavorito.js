import { useQuery } from "@tanstack/react-query";
import { getProductoFavoritos } from "../api/ProductoFavorito";

export const useProductoFavoritos = () => {
  return useQuery({
    queryKey: ["productoFavoritos"],      // Clave única para el caché
    queryFn: getProductoFavoritos,        // Función que obtiene los Banners
    staleTime: 1000 * 60 * 5,     // Los datos se consideran frescos durante 5 minutos
  });
};