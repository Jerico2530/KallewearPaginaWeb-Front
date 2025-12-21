/**
 * Componente de Carrito Flotante
 *
 * Propósito del componente:
 *   - Mostrar un botón de acceso rápido al carrito de compras del usuario.
 *   - Indicar la cantidad total de productos en el carrito mediante un badge.
 *   - Permitir abrir el panel lateral del carrito de forma interactiva.
 *
 * Funcionalidades clave del proyecto:
 *   - Integración con el store global para mostrar/ocultar el carrito.
 *   - Obtención de datos del carrito del usuario mediante hook personalizado.
 *   - Cálculo dinámico del total de productos en el carrito.
 *   - Diseño responsivo y compatible con modo oscuro.
 */

import { FaCartShopping } from "react-icons/fa6";
import useOffcanvasStore from "../../../store/offcanvasStore";
import useUserStore from "../../../store/userStore";
import { useCarritoComprasUsuario } from "../../../hooks/useCarrito";

const MyCart = () => {
  //  Función para mostrar el carrito desde el store global
  const { setCarritoVisible } = useOffcanvasStore();
  //  Obtener ID del usuario actual desde el store global
  const usuarioId = useUserStore((state) => state.usuarioId);
  // Obtener datos del carrito del usuario mediante hook
  const { data: carritoData = { items: [], totalCarrito: 0 } } =
    useCarritoComprasUsuario(usuarioId);

  // Calcular total de productos sumando las cantidades de cada item
  const totalProducts = carritoData.items.reduce(
    (acc, item) => acc + (item.cantidad || 0),
    0
  );

  return (
    <button
      type="button"
      onClick={() => setCarritoVisible(true)} // 🔹 aquí
      className="relative ml-auto mr-3 p-2 rounded-full text-white bg-primary hover:bg-secondary transition duration-300"
    >
      {/* Icono del carrito */}
      <FaCartShopping className="text-2xl" />
      {/* Badge que muestra el total de productos */}
      {totalProducts > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {totalProducts}
        </span>
      )}
    </button>
  );
};

export default MyCart;
