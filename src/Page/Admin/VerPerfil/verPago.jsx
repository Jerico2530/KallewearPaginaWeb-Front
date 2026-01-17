import React from "react";
import AccountLayout from "../../../components/UI/AccountLayout";
import { CreditCard, Wallet, Pencil, Trash2 } from "lucide-react";
import InfoTarjetaModal from "../../../components/UI/InfoTarjetaModal";
import { useVerPago } from "./Logica/useVerPago";

const VerPago = () => {
  const {
    user,
    infoTarjetas,
    isLoading,
    isError,
    openModal,
    modo,
    tarjetaSeleccionada,
    abrirCrear,
    abrirEditar,
    eliminar,
    onSubmit,
    cerrarModal,
    errores, // <-- nuevos errores visibles
  } = useVerPago();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Cargando medios de pago...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error al cargar tus medios de pago</p>
      </div>
    );
  }

  return (
    <AccountLayout user={user}>
      <div className="space-y-10">
        {/* ================= TOP BAR ================= */}
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Medios de pago
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Gestiona tus tarjetas para un pago rápido y seguro.
            </p>
          </div>

          <button
            onClick={abrirCrear}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            + Agregar tarjeta
          </button>
        </section>

        {/* ================= SECURITY ================= */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🔒 Tus datos de pago están protegidos mediante cifrado y cumplen con estándares de seguridad PCI-DSS.
          </p>
        </section>

        {/* ================= LISTADO ================= */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Todos tus métodos
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {infoTarjetas.map((tarjeta) => {
              const ultimos4 = tarjeta.numeroTarjeta?.slice(-4) ?? "****";
              const esBilletera = tarjeta.tipoPago?.toLowerCase().includes("billetera");

              const bgColor = tarjeta.estado
                ? "bg-gray-100 dark:bg-gray-800"
                : "bg-gray-300 dark:bg-gray-700";

              const iconBg = tarjeta.estado
                ? "bg-gray-100 dark:bg-gray-800"
                : "bg-gray-300 dark:bg-gray-700";

              const iconColor = tarjeta.estado
                ? "text-gray-800 dark:text-gray-200"
                : "text-gray-500";

              return (
                <article
                  key={tarjeta.infoTarjetaId}
                  className={`relative group rounded-2xl p-5 h-44 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition ${bgColor}`}
                >
                  {/* ===== Acciones hover ===== */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition flex gap-2 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm px-1">
                    <button
                      onClick={() => abrirEditar(tarjeta)}
                      className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => eliminar(tarjeta.infoTarjetaId)}
                      className="p-2 rounded-full text-red-500 hover:bg-red-100 transition"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Icono y tipo */}
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${iconBg} transition flex items-center justify-center`}>
                      {esBilletera ? (
                        <Wallet size={22} className={iconColor} />
                      ) : (
                        <CreditCard size={22} className={iconColor} />
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      {tarjeta.tipoPago}
                    </span>
                  </div>

                  {/* Información */}
                  <div className="mt-6 space-y-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {tarjeta.descripcionMedioPago}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      •••• •••• •••• {ultimos4}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        tarjeta.estado
                          ? "text-gray-600 dark:text-gray-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {tarjeta.estado ? "Activo" : "Inactivo"} | Vence {tarjeta.fechaVencimiento}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          {!infoTarjetas.length && (
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-500">Aún no tienes medios de pago registrados.</p>
              <p className="text-sm text-gray-400 mt-1">Agrega una tarjeta para agilizar tus compras.</p>
            </div>
          )}
        </section>
      </div>

      {/* ================= MODAL ================= */}
      <InfoTarjetaModal
        open={openModal}
        modo={modo}
        tarjeta={tarjetaSeleccionada}
        onClose={cerrarModal}
        onSubmit={onSubmit}
        errores={errores} // <-- errores visibles
      />
    </AccountLayout>
  );
};

export default VerPago;
