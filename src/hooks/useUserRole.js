/**
 * useUserRoles Hooks
 * ---------------------------------------------------------------------
 * Este archivo gestiona la administración y consulta de roles de usuario
 * dentro del sistema, vinculando los permisos del usuario autenticado con
 * la información almacenada en el servidor.
 *
 * Propósito del módulo:
 * - Identificar el rol actual del usuario y facilitar la gestión de
 *   permisos en la interfaz.
 * - Proveer hooks reutilizables para el mantenimiento de roles mediante
 *   React Query, optimizando caché y sincronización automática.
 *
 * Funcionalidades clave:
 * - useUserRole: retorna el rol activo del usuario logueado.
 * - useUserRoles: obtiene y mantiene el listado de roles actualizado.
 * - useCreateUserRole / useUpdateUserRole / useDeleteUserRole:
 *   operaciones de mantenimiento con refresco automático del estado.
 * - useExportarExcelUserRoles: exporta el catálogo de roles sin afectar
 *   los datos almacenados en caché.
 */

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserRoles,
  createUserRoles,
  deleteUserRoles,
  updateUserRoles,
  exportarExcelUserRoles,
} from "../api/UseRol";
import useUserStore from "../store/userStore";

// Hook para saber el rol actual del usuario logueado
export const useUserRole = () => {
  const roles = useUserStore((state) => state.roles);
  return roles?.[0] || "Invitado"; // Se retorna únicamente el primer rol asignadol
};

// Consulta de UserRol con caché y revalidación automática
export const useUserRoles = () => {
  return useQuery({
    queryKey: ["userRoles"], // Identificador del recurso en caché
    queryFn: getUserRoles, // Solicita los datos al servidor
    staleTime: 1000 * 60 * 5, // Tiempo que los datos se consideran vigentes
  });
};

// Creación de un nuevo UserRol
export const useCreateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUserRoles,
    onSuccess: () => queryClient.invalidateQueries(["userRoles"]),
  });
};

// Actualización de un UserRol existente
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserRoles,
    onSuccess: () => queryClient.invalidateQueries(["userRoles"]),
  });
};

// Eliminación de un UserRol
export const useDeleteUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserRoles,
    onSuccess: () => queryClient.invalidateQueries(["userRoles"]),
  });
};

// Exportación de UserRol a Excel (no modifica caché)
export const useExportarExcelUserRoles = () => {
  return useMutation({
    mutationFn: exportarExcelUserRoles,
  });
};
