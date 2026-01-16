/**
 * Lógica para la administración de Usuarios.
 * ------------------------------------------------------------------
 * Propósito:
 *  - Centralizar el flujo completo de gestión de usuarios desde el panel
 *    administrativo utilizando React Query.
 *  - Mantener los componentes UI limpios separando la lógica de negocio.
 *  - Validar formularios y gestionar notificaciones profesionales.
 *
 * Funcionalidades clave:
 *  - Consultar y mantener sincronizado el listado de Usuarios.
 *  - Crear, modificar y eliminar usuarios, actualizando correctamente la UI.
 *  - Controlar el estado de edición para una experiencia más intuitiva.
 *  - Manejo correcto de errores provenientes del servidor.
 *  - Exportación de datos a Excel.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUsuarios,
  useCrearUsuario,
  useUpdateUsuario,
  useDeleteUsuario,
  useExportarExcelUsuarios,
} from "../../../../hooks/useUsuario";
import { useAdminNotifier } from "../../../../constants/AdminNotifier";
import { handleApiError } from "../../../../utils/handleApiError";

export const useUsuariosAdmin = (nuevoUsuarioForm, editUsuarioForm) => {
  // ID del carrito actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar Excel
  const exportarExcel = useExportarExcelUsuarios();
  // Servicio centralizado de notificaciones UI
  const notify = useAdminNotifier();
  // Consulta principal de datos del carrito (caché integrada)
  const { data: usuariosData = [], isLoading } = useUsuarios();
  // Mutaciones CRUD
  const crearUsuario = useCrearUsuario();
  const updateUsuario = useUpdateUsuario();
  const deleteUsuario = useDeleteUsuario();

  // Ordenamiento por fechaRegistro y nombre
  const usuarios = usuariosData.slice().sort((a, b) => {
    const dateA = new Date(a.fechaRegistro).getTime();
    const dateB = new Date(b.fechaRegistro).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.nombreCompleto.localeCompare(b.nombreCompleto);
  });

  /** Crear usuario */
  const handleCrear = async () => {
    // Evita enviar datos inválidos
    if (!(await nuevoUsuarioForm.validate())) {
      notify.validationError();
      return;
    }
    notify.createPromise(
      crearUsuario.mutateAsync(nuevoUsuarioForm.values)
        .then(() => {
          queryClient.invalidateQueries(["usuario"]);
          nuevoUsuarioForm.resetForm();
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  /** Iniciar modo edición cargando los datos seleccionados */
  const handleEditar = (usuario) => {
    setEditandoId(usuario.usuarioId);
    // Seteo seguro: se asigna valor vacío si el campo no existe
    editUsuarioForm.setValues({
      nombreCompleto: usuario.nombreCompleto || "",
      apellidoCompleto: usuario.apellidoCompleto || "",
      dni: usuario.dni || "",
      imagen: usuario.imagen || "",
      correoElectronico: usuario.correoElectronico || "",
      fechaNacimiento: usuario.fechaNacimiento?.substring(0, 10) || "",
      estado: usuario.estado ?? true,
    });
  };

  /** Guardar cambios de edición */
  const handleGuardar = async () => {
    if (!(await editUsuarioForm.validate())) {
      notify.validationError(); 
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { usuarioId: editandoId, ...editUsuarioForm.values };

     notify.updatePromise(
      updateUsuario.mutateAsync(dataEditar)
        .then(() => {
          setEditandoId(null);
          editUsuarioForm.resetForm();
          queryClient.invalidateQueries(["usuario"]);
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editUsuarioForm.resetForm();
    notify.cancelled();
  };

  /** Eliminar usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmDelete();
    if (!confirmar) return;

    notify.deletePromise(
      deleteUsuario.mutateAsync(id)
        .then(() => {
          if (editandoId === id) {
            setEditandoId(null);
            editUsuarioForm.resetForm();
          }

          nuevoUsuarioForm.resetForm();

          queryClient.setQueryData(["usuarios"], (old) =>
            old ? old.filter((u) => u.usuarioId !== id) : []
          );

          queryClient.invalidateQueries(["usuarios"]);
        })
        .catch((error) => {
          handleApiError(error);
          throw error;
        })
    );
  };

  /** Exportar la lista de anuncios en un archivo Excel */
  const descargarExcel = () => {
  notify.exportPromise(
    exportarExcel
      .mutateAsync()
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data])
        );

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "usuarios.xlsx");

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        handleApiError(error, notify);
        throw error; // 🔑 NECESARIO para toast.promise
      })
  );
};

  return {
    usuarios,
    isLoading,
    editandoId,
    handleCrear,
    handleEditar,
    handleGuardar,
    handleCancelar,
    handleEliminar,
    descargarExcel,
  };
};
