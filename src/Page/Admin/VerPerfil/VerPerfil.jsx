import React, { useEffect, useState, useMemo } from "react";
import { User, Lock, Monitor, ChevronRight } from "lucide-react";
import AccountLayout from "../../../components/UI/AccountLayout";
import { useUsuarioActual } from "../../../hooks/useUsuarioActual";
import { useUpdateUsuario } from "../../../hooks/useUsuario";

/**
 * Formatea los datos del usuario
 * - Une nombres y apellidos completos
 * - Preparado para ser escalable a más campos en el futuro
 */
const formatearPerfil = (userInfo) => {
  if (!userInfo) return null;
  return {
    ...userInfo,
    nombreCompleto: userInfo.nombreCompleto?.trim() || "",
    apellidoCompleto: userInfo.apellidoCompleto?.trim() || "",
  };
};

const VerPerfil = () => {
  const { data: userInfo, isLoading } = useUsuarioActual();
  const updateUsuario = useUpdateUsuario();

  const [imagePreview, setImagePreview] = useState(null);
  const [editableFields, setEditableFields] = useState({});
  const [editedValues, setEditedValues] = useState({});

  const perfil = useMemo(() => formatearPerfil(userInfo), [userInfo]);

  useEffect(() => {
    if (perfil?.imagen) setImagePreview(perfil.imagen);

    if (perfil) {
      setEditedValues({
        nombreCompleto: perfil.nombreCompleto,
        apellidoCompleto: perfil.apellidoCompleto,
        dni: perfil.dni,
      });
    }
  }, [perfil]);

  if (isLoading || !perfil) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Cargando información del usuario...
      </div>
    );
  }

  const user = {
    nombreCompleto: perfil.nombreCompleto,
    apellidoCompleto: perfil.apellidoCompleto,
    imagen: imagePreview,
  };

  const handleEditClick = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleSaveClick = async (field) => {
    try {
      const payload = {
        usuarioId: perfil.usuarioId,
        nombreCompleto: editedValues.nombreCompleto,
        apellidoCompleto: editedValues.apellidoCompleto,
        dni: editedValues.dni,
        fechaNacimiento: perfil.fechaNacimiento,
        imagen: perfil.imagen || "",
        correoElectronico: perfil.correoElectronico,
        estado: perfil.estado,
      };

      await updateUsuario.mutateAsync(payload);
      setEditableFields((prev) => ({ ...prev, [field]: false }));
      console.log(`Campo ${field} actualizado:`, editedValues[field]);
    } catch (err) {
      console.error("Error al guardar:", err.response?.data || err);
    }
  };

  return (
    <AccountLayout user={user}>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* ================= HEADER ================= */}
        <header className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Mi cuenta</h2>
          <p className="text-gray-500">
            Gestiona tu información personal, seguridad y preferencias. Mantén tus datos actualizados para que tu cuenta sea segura y confiable.
          </p>
        </header>

        {/* ================= INFORMACIÓN PERSONAL ================= */}
        <SectionCard title="Información personal">
          <p className="text-sm text-gray-500 mb-4">
            Asegúrate de que tu nombre, apellido y documento estén correctos. Esta información es importante para facturación y notificaciones.
          </p>

          <ProfileRowEditable
            label="Nombre completo"
            field="nombreCompleto"
            value={editedValues.nombreCompleto}
            editable
            isEditing={editableFields.nombreCompleto}
            onEdit={() => handleEditClick("nombreCompleto")}
            onChange={(val) => setEditedValues((prev) => ({ ...prev, nombreCompleto: val }))}
            onSave={() => handleSaveClick("nombreCompleto")}
          />

          <ProfileRowEditable
            label="Apellido completo"
            field="apellidoCompleto"
            value={editedValues.apellidoCompleto}
            editable
            isEditing={editableFields.apellidoCompleto}
            onEdit={() => handleEditClick("apellidoCompleto")}
            onChange={(val) => setEditedValues((prev) => ({ ...prev, apellidoCompleto: val }))}
            onSave={() => handleSaveClick("apellidoCompleto")}
          />

          <ProfileRowEditable
            label="Documento"
            field="dni"
            value={editedValues.dni || ""}
            editable
            isEditing={editableFields.dni}
            onEdit={() => handleEditClick("dni")}
            onChange={(val) => setEditedValues((prev) => ({ ...prev, dni: val }))}
            onSave={() => handleSaveClick("dni")}
            hint="Tu documento es necesario para validar tu identidad en la plataforma"
          />

          <ProfileRow
            label="Correo electrónico"
            value={perfil.correoElectronico}
            hint="Este correo se usa para iniciar sesión y recibir notificaciones importantes"
          />
        </SectionCard>
      </div>
    </AccountLayout>
  );
};

/* ================= COMPONENTES ================= */

const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
    <h3 className="text-lg font-semibold border-b pb-3">{title}</h3>
    {children}
  </div>
);

const ProfileRowEditable = ({
  label,
  value,
  editable,
  isEditing,
  onEdit,
  onChange,
  onSave,
  hint,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b last:border-none pb-4 last:pb-0 gap-2">
    <div className="flex-1 space-y-0.5">
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      {isEditing ? (
        <input
          type="text"
          className="border p-2 rounded w-full text-gray-900"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p className="text-base font-medium text-gray-900">{value}</p>
      )}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
    {editable && (
      <button
        className="text-sm text-blue-600 font-semibold hover:underline mt-2 sm:mt-0 sm:ml-4"
        onClick={isEditing ? onSave : onEdit}
      >
        {isEditing ? "Guardar" : "Editar"}
      </button>
    )}
  </div>
);

const ProfileRow = ({ label, value, hint }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b last:border-none pb-4 last:pb-0">
    <div className="flex-1 space-y-0.5">
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-base font-medium text-gray-900">{value}</p>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  </div>
);

const ActionRow = ({ icon, title, description }) => (
  <button className="w-full flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-gray-200 hover:bg-gray-50 transition">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-gray-100 rounded-lg text-gray-700">{icon}</div>
      <div className="text-left">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <ChevronRight size={16} className="text-gray-400" />
  </button>
);

export default VerPerfil;
