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
import { useNotification } from "../../../../utils/NotificationService";
import { handleApiError } from "../../../../utils/handleApiError";

export const useUsuariosAdmin = (nuevoUsuarioForm, editUsuarioForm) => {
  // ID del carrito actualmente en edición (control de modo edición)
  const [editandoId, setEditandoId] = useState(null);
  // React Query: acceso completo a la caché para revalidación manual
  const queryClient = useQueryClient();
  // Mutación para exportar Excel
  const exportarExcel = useExportarExcelUsuarios();
  // Servicio centralizado de notificaciones UI
  const notify = useNotification();
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
      notify.warning("Por favor corrige los errores del formulario.");
      return;
    }
    crearUsuario.mutate(nuevoUsuarioForm.values, {
      onSuccess: () => {
        notify.success("Usuario creado correctamente");
        queryClient.invalidateQueries(["usuario"]); // sincroniza la vista
        nuevoUsuarioForm.resetForm(); // limpia campos
      },
      onError: (error) => handleApiError(error, notify),
    });
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
      notify.warning("Por favor corrige los errores antes de guardar.");
      return;
    }
    // Se envía el ID que se está editando más los valores actualizados
    const dataEditar = { usuarioId: editandoId, ...editUsuarioForm.values };

    updateUsuario.mutate(dataEditar, {
      onSuccess: () => {
        notify.success("Usuario actualizado correctamente");
        setEditandoId(null);
        editUsuarioForm.resetForm();
        queryClient.invalidateQueries(["usuario"]);
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Cancelar edición restableciendo estado */
  const handleCancelar = () => {
    setEditandoId(null);
    editUsuarioForm.resetForm();
    notify.info("Edición cancelada");
  };

  /** Eliminar usuario */
  const handleEliminar = async (id) => {
    const confirmar = await notify.confirmAsync(
      "¿Seguro que deseas eliminar este usuario?"
    );
    if (!confirmar) return;

    deleteUsuario.mutate(id, {
      onSuccess: (data) => {
        if (data?.isExitoso) {
          notify.success("Usuario eliminado correctamente");

          // Si el elemento eliminado estaba en edición, salir del modo edición
          if (editandoId === id) {
            setEditandoId(null);
            editUsuarioForm.resetForm();
          }
          // Se limpia también el formulario de creación
          nuevoUsuarioForm.resetForm();
          // Optimización: actualización inmediata de la lista en caché
          queryClient.setQueryData(["usuarios"], (old) =>
            old ? old.filter((c) => c.usuarioId !== id) : []
          );
          // Revalidación para asegurar consistencia total
          queryClient.invalidateQueries(["usuarios"]);
        }
      },
      onError: (error) => handleApiError(error, notify),
    });
  };

  /** Exportar la lista de anuncios en un archivo Excel */
  const descargarExcel = async () => {
    try {
      const response = await exportarExcel.mutateAsync();

      // Crear el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un link temporal
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "usuarios.xlsx"); // nombre del archivo

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      notify.success("Excel descargado correctamente");
    } catch (err) {
      notify.error("Error al descargar el Excel");
    }
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
