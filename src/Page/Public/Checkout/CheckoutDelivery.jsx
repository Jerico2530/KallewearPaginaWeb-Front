/**
 * CheckoutDelivery.jsx
 *
 * Descripción del proyecto:
 * Este componente forma parte del flujo de checkout de una tienda en línea.
 * Su propósito es permitir al usuario seleccionar el método de entrega de su orden,
 * ya sea retiro en tienda o envío a domicilio, y gestionar las direcciones de envío.
 * Garantiza que la orden se cree correctamente con la información necesaria antes
 * de proceder al pago.
 *
 * Funcionalidades clave:
 * 1. Selección entre retiro en tienda o envío a domicilio.
 * 2. Manejo de direcciones guardadas o creación de una nueva dirección.
 * 3. Validaciones para asegurar que se haya seleccionado o completado la información requerida.
 * 4. Creación de la orden con los productos del carrito y datos de entrega.
 * 5. Navegación hacia el resumen de orden (`CartTotal`) tras procesar la orden.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutLayout from "../Checkout/CheckoutLayout";
import { useCrearOrden } from "../../../hooks/useOrden";
import {
  useCrearDirecciones,
  useDirecciones,
} from "../../../hooks/useDireccion";
import useUserStore from "../../../store/userStore";
import { useSucursales } from "../../../hooks/useSucursal";
import { useCarritoComprasUsuario } from "../../../hooks/useCarrito";
import { getDirecciones } from "../../../api/Direccion";

const CheckoutDelivery = () => {
  const navigate = useNavigate();
  // Hook para crear una nueva orden
  const crearOrden = useCrearOrden();
  // Hook para crear nuevas direcciones
  const crearDireccion = useCrearDirecciones();
  // Datos del usuario
  const { usuarioId, nombreCompleto, apellidoCompleto, dni } = useUserStore();
  // Datos de sucursales, carrito y direcciones del usuario
  const { data: sucursales = [], isLoading: loadingSucursales } =
    useSucursales();
  const {
    data: carritoData = { items: [], totalCarrito: 0 },
    isLoading: loadingCarrito,
  } = useCarritoComprasUsuario(usuarioId);
  const { data: direcciones = [], isLoading: loadingDirecciones } =
    useDirecciones(usuarioId);

  const { items: carritoItems, totalCarrito } = carritoData;
  // Estados locales para el método de entrega, formulario y visibilidad de nueva dirección
  const [method, setMethod] = useState("store");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    apellidoCompleto: "",
    dni: "",
    sucursalId: "",
    direccionId: "",
    departamento: "",
    provincia: "",
    distrito: "",
    via: "",
    numero: "",
  });
  // Inicializar datos del usuario en el formulario
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      nombreCompleto: nombreCompleto || "",
      apellidoCompleto: apellidoCompleto || "",
      dni: dni || "",
    }));
  }, [nombreCompleto, apellidoCompleto, dni]);
  // Maneja cambios en los inputs del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Función principal para validar y crear la orden
  const goNext = async () => {
    try {
      if (!carritoItems.length) {
        alert("Su carrito no tiene productos.");
        return;
      }
      // Validaciones según método de entrega
      if (method === "store" && !formData.sucursalId) {
        alert("Debe seleccionar una sucursal");
        return;
      }

      if (method === "delivery") {
        if (!formData.direccionId && !showNewAddress) {
          alert("Debe seleccionar una dirección o agregar una nueva");
          return;
        }
        if (showNewAddress) {
          const { departamento, provincia, distrito, via, numero } = formData;
          if (!departamento || !provincia || !distrito || !via || !numero) {
            alert("Debe completar todos los campos de la dirección para envío");
            return;
          }
        }
      }
      // Crear nueva dirección si aplica
      let direccionId = formData.direccionId || null;
      if (method === "delivery" && showNewAddress) {
        const direccionPayload = {
          departamento: formData.departamento,
          provincia: formData.provincia,
          distrito: formData.distrito,
          via: formData.via,
          numero: formData.numero,
          usuarioId,
          estado: true,
        };

        await crearDireccion.mutateAsync(direccionPayload);
        // Obtener ID de la dirección recién creada
        const todasDirecciones = await getDirecciones(usuarioId);
        const direccionRecienCreada = todasDirecciones.find(
          (d) =>
            d.departamento === formData.departamento &&
            d.provincia === formData.provincia &&
            d.distrito === formData.distrito &&
            d.via === formData.via &&
            d.numero === formData.numero
        );

        if (!direccionRecienCreada)
          throw new Error("No se pudo obtener el ID de la dirección creada");

        direccionId = direccionRecienCreada.direccionId;
      }
      // Preparar payload de la orden
      const payload = {
        usuarioId,
        carritoId: carritoItems[0].carritoId,
        metodoEntrega: method === "store" ? "RetiroTienda" : "Envio",
        total: totalCarrito || 0,
        productos: carritoItems,
        sucursalId: method === "store" ? parseInt(formData.sucursalId) : null,
        direccionId: method === "delivery" ? direccionId : null,
        estado: true,
      };
      // Crear la orden
      const nuevaOrden = await crearOrden.mutateAsync(payload);
      const ordenIdCreada = nuevaOrden?.ordenId;
      if (!ordenIdCreada)
        throw new Error("No se pudo obtener el ID de la orden creada");
      // Navegar al resumen de orden
      navigate(`/cartTotal/${ordenIdCreada}`);
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al procesar su orden. Intente nuevamente.");
    }
  };

  return (
    <CheckoutLayout step={2}>
      {/* Contenedor centrado y ajustado al alto del viewport */}
      <div className="flex justify-center items-center min-h-[calc(100vh-220px)] px-4">
        {/*  Card principal centrada, sin fondo pero con borde suave */}
        <div className="w-full max-w-2xl bg-transparent border border-gray-300 dark:border-gray-700 rounded-3xl p-8 md:p-10 shadow-lg backdrop-blur-sm animate-fadeIn text-gray-900 dark:text-white">
          <h2 className="text-3xl font-bold mb-8 text-center text-secondary dark:text-secondary">
            🚚 Método de Entrega
          </h2>

          {/* Botones de selección de método */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setMethod("store")}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                method === "store"
                  ? "bg-secondary text-white scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
              }`}
            >
              Retiro en Tienda
            </button>
            <button
              onClick={() => setMethod("delivery")}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                method === "delivery"
                  ? "bg-secondary text-white scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
              }`}
            >
              Envío a Domicilio
            </button>
          </div>

          {/* Formulario de datos del usuario y selección de sucursal/dirección */}
          <form className="space-y-4">
            {["nombreCompleto", "apellidoCompleto", "dni"].map((field, idx) => (
              <input
                key={idx}
                type="text"
                name={field}
                placeholder={
                  field === "dni"
                    ? "DNI"
                    : field === "apellidoCompleto"
                    ? "Apellidos Completos"
                    : "Nombre Completo"
                }
                onChange={handleChange}
                value={formData[field]}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
              />
            ))}

            {/* Selección de sucursal para retiro en tienda */}
            {method === "store" && (
              <select
                name="sucursalId"
                onChange={handleChange}
                value={formData.sucursalId}
                disabled={loadingSucursales}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary transition"
              >
                <option value="">Seleccionar sucursal</option>
                {sucursales
                  .filter((s) => s.estado)
                  .map((s) => (
                    <option key={s.sucursalId} value={s.sucursalId}>
                      {s.locales} - {s.descripcion}
                    </option>
                  ))}
              </select>
            )}

            {/* Envío a domicilio */}
            {method === "delivery" && (
              <>
                {direcciones.length > 0 && !showNewAddress && (
                  <select
                    name="direccionId"
                    onChange={handleChange}
                    value={formData.direccionId}
                    disabled={loadingDirecciones}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary transition mb-2"
                  >
                    <option value="">Seleccionar dirección guardada</option>
                    {direcciones
                      .filter((d) => d.estado)
                      .map((d) => (
                        <option key={d.direccionId} value={d.direccionId}>
                          {`${d.departamento}, ${d.provincia}, ${d.distrito}, ${d.via} ${d.numero}`}
                        </option>
                      ))}
                  </select>
                )}
                {/* Botón para agregar nueva dirección */}
                {!showNewAddress && (
                  <button
                    type="button"
                    onClick={() => setShowNewAddress(true)}
                    className="w-full bg-secondary text-white font-semibold py-2 rounded-lg shadow-md hover:scale-[1.02] transition-transform mb-4"
                  >
                    + Agregar nueva dirección
                  </button>
                )}
                {/* Formulario para nueva dirección */}
                {showNewAddress && (
                  <div className="mt-2 space-y-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-5 rounded-xl shadow-inner animate-slideIn">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Nueva Dirección
                    </h3>
                    {[
                      "departamento",
                      "provincia",
                      "distrito",
                      "via",
                      "numero",
                    ].map((field) => (
                      <input
                        key={field}
                        type="text"
                        name={field}
                        placeholder={
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary transition"
                      />
                    ))}
                    {/* Botones de acción para guardar o cancelar nueva dirección */}
                    <div className="flex gap-3 mt-3">
                      <button
                        type="button"
                        onClick={goNext}
                        className="flex-1 bg-secondary text-white font-semibold py-2 rounded-lg shadow-md hover:scale-[1.02] transition-transform"
                      >
                        Guardar Dirección
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewAddress(false)}
                        className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </form>

          {/* 🔹 Botón continuar */}
          <button
            onClick={goNext}
            disabled={
              crearOrden.isLoading || crearDireccion.isLoading || loadingCarrito
            }
            className="mt-10 w-full bg-gradient-to-r from-secondary to-gray-900 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {crearOrden.isLoading || crearDireccion.isLoading || loadingCarrito
              ? "Procesando..."
              : "Continuar a Pago 💳"}
          </button>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default CheckoutDelivery;
