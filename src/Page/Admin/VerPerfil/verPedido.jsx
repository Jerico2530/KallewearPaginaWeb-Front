import React from "react";
import AccountLayout from "../../../components/UI/AccountLayout";
import useUserStore from "../../../store/userStore";
import { useOrdenes } from "../../../hooks/useOrden";
import {
  ShoppingBag,
  Calendar,
  Truck,
  CreditCard,
} from "lucide-react";


const VerPedido = () => {
  const { nombreCompleto, apellidoCompleto, imagen } = useUserStore();

  const user = { nombreCompleto, apellidoCompleto, imagen };

  const { data: ordenes = [], isLoading, isError } = useOrdenes();

  /* ===================== ESTADOS ===================== */
  if (isLoading) {
    return (
      <AccountLayout user={user}>
        {/* ✅ Ahora loading respeta el layout */}
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 animate-pulse">
            Cargando pedidos...
          </p>
        </div>
      </AccountLayout>
    );
  }

  if (isError) {
    return (
      <AccountLayout user={user}>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">
            Error al cargar las órdenes.
          </p>
        </div>
      </AccountLayout>
    );
  }

  if (!ordenes.length) {
    return (
      <AccountLayout user={user}>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">
            No tienes pedidos registrados.
          </p>
        </div>
      </AccountLayout>
    );
  }

  return (
    /* ====================================================
       ✅ FIX PROFESIONAL:
       - Eliminamos section, max-w, px, sidebar
       - AccountLayout controla TODO eso
       ==================================================== */
    <AccountLayout user={user}>
      {/* ================= CONTENIDO DE LA PÁGINA ================= */}
      <div className="space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold text-gray-900">
            Mis pedidos
          </h1>
          <p className="text-sm text-gray-500">
            Historial de tus compras realizadas
          </p>
        </header>

        {/* Lista de órdenes */}
        <section
          className="
            bg-white
            rounded-xl
            shadow-sm
            divide-y divide-gray-100
          "
        >
          {ordenes.map((orden) => (
            <article
              key={orden.ordenId}
              className="
                px-6 py-4
                grid grid-cols-1 sm:grid-cols-[1fr_140px_140px_160px]
                gap-4 items-center
                hover:bg-gray-50
                transition-colors
              "
            >
              {/* Orden */}
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-gray-400" />
                <p className="font-semibold">
                  Orden #{orden.ordenId}
                </p>
              </div>

              {/* Fecha */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                {new Date(orden.fechaRegistro).toLocaleDateString()}
              </div>

              {/* Entrega */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Truck size={16} />
                {orden.metodoEntrega}
              </div>

              {/* Total */}
              <div className="flex items-center justify-end gap-3 text-right">
                <CreditCard size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-bold">
                    S/ {orden.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </AccountLayout>
  );
};

export default VerPedido;