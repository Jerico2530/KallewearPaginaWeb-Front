const queryClient = useQueryClient();

const handleConfirm = async () => {
  // 🔹 Crear pago normalmente
  await createPago.mutateAsync(payload);

  // 🔹 Vaciar visualmente el carrito dinámicamente
  queryClient.setQueryData(["carritoCompra", usuarioId], {
    items: [],
    totalCarrito: 0,
  });

  // 🔹 Navegar a página de orden confirmada
  navigate("/ordenDetallado", { state: { ordenId } });
};
