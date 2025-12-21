/**
 * ProductPage.jsx
 *
 * Descripción del proyecto:
 * Página de detalle de producto para Kallewear, donde los usuarios pueden
 * ver información completa del producto, seleccionar tallas disponibles
 * y agregarlo al carrito de compras.
 *
 * Funcionalidades clave:
 * 1. Obtención de datos del producto y sus tallas mediante hooks personalizados.
 * 2. Construcción dinámica de las tallas disponibles según el producto seleccionado.
 * 3. Funcionalidad para agregar productos al carrito, con manejo de stock y cantidad.
 * 4. Integración con stores globales para usuario y balanceo visual en la UI.
 * 5. Manejo de estados de carga y error para mejorar la experiencia del usuario.
 *
 * Propósito:
 * Facilitar la compra de productos mostrando información detallada y permitiendo
 * interacciones seguras y eficientes dentro de la plataforma de e-commerce.
 */

import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useProductoTallaById,
  useProductoTallas,
} from "../../../hooks/useProductoTalla";
import ProductDetail from "../../../components/UI/ProductDetail";
import {
  useCarritoCompras,
  useCrearCarritoCompras,
  useActualizarCarritoCompras,
} from "../../../hooks/useCarrito";

import useUserStore from "../../../store/userStore";
import useBalanceStore from "../../../store/balanceStore";

const ProductPage = () => {
  const { productoTallaId } = useParams();
  // Hook para obtener información del producto específico por ID de talla
  const {
    data: product,
    isLoading,
    isError,
  } = useProductoTallaById(productoTallaId);

  // Hook para obtener todas las tallas de productos
  const { data: allTallas } = useProductoTallas();

  const crearCarrito = useCrearCarritoCompras();
  const actualizarCarrito = useActualizarCarritoCompras();
  const { usuarioId } = useUserStore();
  const { toggleBalanceo } = useBalanceStore();

  // Construcción de las tallas disponibles solo para el producto seleccionado
  const availableSizes = useMemo(() => {
    if (!product || !allTallas) return [];

    return allTallas
      .filter((t) => t.productoId === product.productoId)
      .map((t) => ({
        productoTallaId: t.productoTallaId,
        tallaId: t.tallaId,
        tipoTalla: t.tipoTalla,
        stock: t.stock,
        categoria: t.categoria,
        productoCategoriaId: t.productoCategoriaId,
      }));
  }, [product, allTallas]);

  // Función para agregar producto al carrito
  const handleAddToCart = (productoBase, tallaSeleccionada, cantidad) => {
    if (!tallaSeleccionada) return alert("Selecciona una talla");

    crearCarrito.mutate(
      {
        usuarioId,
        productoTallaId: tallaSeleccionada.productoTallaId,
        cantidad,
        precioUnitario: productoBase.precio,
        subTotal: productoBase.precio * cantidad,
        estado: true,
      },
      {
        onSuccess: () => {
          // Actualiza el estado de balanceo visual en el carrito
          toggleBalanceo(true);
        },
        onError: (err) => console.error("Error al agregar:", err),
      }
    );
  };
  
  // Manejo de estados de carga y error
  if (isLoading) return <p>Cargando producto...</p>;
  if (isError || !product) return <p>Producto no encontrado</p>;

  return (
    <div className="min-h-screen p-6">
      <ProductDetail
        product={product}
        availableSizes={availableSizes}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default ProductPage;
