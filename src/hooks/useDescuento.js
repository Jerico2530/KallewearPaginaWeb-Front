// hooks/useDescuento.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDescuentos, createDescuentos, updateDescuentos, deleteDescuentos , getDescuentosActivos } from "../api/Descuento";

export const useDescuentos = () => {
  return useQuery({
    queryKey: ["descuentos"],
    queryFn: getDescuentos,
    staleTime: 1000 * 60 * 5, 
  })
};

export const useDescuentosActivos = () => {
  return useQuery({
    queryKey: ["descuentos-activos"],
    queryFn: getDescuentosActivos,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateDescuento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDescuentos,
    onSuccess: () => queryClient.invalidateQueries(["descuentos"]),
  });
};

export const useUpdateDescuento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDescuentos,
    onSuccess: () => queryClient.invalidateQueries(["descuentos"]),
  });
};

export const useDeleteDescuento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDescuentos,
    onSuccess: () => queryClient.invalidateQueries(["descuentos"]),
  });
};
