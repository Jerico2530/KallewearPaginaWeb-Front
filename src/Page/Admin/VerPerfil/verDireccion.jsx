import React from "react";
import AccountLayout from "../../../components/UI/AccountLayout";
import useUserStore from "../../../store/userStore";
import { useDirecciones } from "../../../hooks/useDireccion";
import { MapPin, Building, Calendar, Home } from "lucide-react";


const VerDireccion = () => {
  const { usuarioId, nombreCompleto, apellidoCompleto, imagen } = useUserStore();

  const user = { nombreCompleto, apellidoCompleto, imagen };

  const {
    data: direcciones = [],
    isLoading,
    isError,
  } = useDirecciones();

  const usuarioIdNumber = Number(usuarioId);

  const direccionesUsuario = Array.isArray(direcciones)
    ? direcciones.filter(dir => dir.usuarioId === usuarioIdNumber)
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">
          Cargando direcciones...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          Error al cargar las direcciones.
        </p>
      </div>
    );
  }

  if (!direccionesUsuario.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          No tienes direcciones registradas.
        </p>
      </div>
    );
  }

   return (

    <AccountLayout user={user}>
      {/* ================= CONTENIDO DE LA PÁGINA ================= */}
      <div className="space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold text-gray-900">
            Mis direcciones
          </h1>
          <p className="text-sm text-gray-500">
            Gestiona tus direcciones de envío
          </p>
        </header>

        {/* Lista de direcciones */}
        <section
          className="
            bg-white
            rounded-xl
            shadow-sm
            divide-y divide-gray-100
          "
        >
          {direccionesUsuario.map((dir) => (
            <article
              key={dir.direccionId}
              className="
                px-6 py-4
                grid grid-cols-1 sm:grid-cols-[1fr_160px]
                gap-4 items-start
                hover:bg-gray-50
                transition
              "
            >
              {/* Dirección */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Home size={18} className="text-gray-400" />
                  <p className="font-semibold">
                    {dir.via} #{dir.numero}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Building size={14} />
                    {dir.distrito}, {dir.provincia}
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {dir.departamento}
                  </span>
                </div>
              </div>

              {/* Fecha */}
              <div className="flex items-center justify-end text-sm text-gray-500">
                <Calendar size={16} className="mr-1" />
                {new Date(dir.fechaRegistro).toLocaleDateString()}
              </div>
            </article>
          ))}
        </section>
      </div>
    </AccountLayout>
  );
};

export default VerDireccion;
