// components/UI/ProductAddToCart.jsx
import React from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import Button from "./Button";
import useSelectedTallas from "../../utils/useSelectedTallas";
import useCarritoActions from "../../utils/useCarritoActions";
import { useCrearCarritoCompras } from "../../hooks/useCarrito";
import useUserStore from "../../store/userStore";
import useBalanceStore from "../../store/balanceStore";

const ProductAddToCart = ({ product }) => {
  const { usuarioId } = useUserStore();
  const { showCartFeedback } = useBalanceStore();
  const { selectedTallas, dispatchTallas } = useSelectedTallas();
  const crearCarrito = useCrearCarritoCompras();

  const { handleAddToCart } = useCarritoActions({
    crearCarrito,
    usuarioId,
    dispatchTallas,
    showCartFeedback,
  });

  const [quantity, setQuantity] = React.useState(1);
  const selectedSize = selectedTallas[product.productoId] || null;

  const handleAdd = () => {
    if (!selectedSize) return alert("Selecciona una talla");
    handleAddToCart(product, selectedSize, quantity);
    setQuantity(1); // reset cantidad si quieres
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Selección de tallas */}
      <div className="flex flex-wrap gap-3">
        {product.tallasDetalle.map((size) => (
          <button
            key={size.productoTallaId}
            onClick={() =>
              dispatchTallas({
                type: "TOGGLE_TALLA",
                payload: { productoId: product.productoId, talla: size },
              })
            }
            className={`px-4 py-2 border rounded-lg transition font-medium ${
              selectedSize?.productoTallaId === size.productoTallaId
                ? "bg-red-600 text-white border-red-600 shadow-lg"
                : "bg-white dark:bg-gray-700 border-gray-300 hover:border-red-600"
            }`}
          >
            {size.tipoTalla}
          </button>
        ))}
      </div>

      {/* Cantidad */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQuantity(Math.max(quantity - 1, 1))}
          className="border rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <IoRemoveCircleOutline size={24} />
        </button>
        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-20 text-center border rounded-lg px-3 py-2 bg-white dark:bg-gray-700"
        />
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="border rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <IoAddCircleOutline size={24} />
        </button>
      </div>

      {/* Botón agregar al carrito */}
      <Button
        onClick={handleAdd}
        disabled={!selectedSize || selectedSize.stock === 0}
        icon={FaShoppingCart}
        className="w-full text-lg mt-2"
      >
        Agregar al carrito
      </Button>

      {/* Stock */}
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Stock: <span className="font-medium text-gray-800 dark:text-gray-100">{selectedSize ? selectedSize.stock : "-"}</span>
      </p>
    </div>
  );
};

export default ProductAddToCart;
