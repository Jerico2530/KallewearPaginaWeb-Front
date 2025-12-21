// src/routes/publicRoutesConfig.js
import MenPage from "../Page/Public/Men/MenPage";
import WomenPage from "../Page/Public/Women/WomenPage";
import TallaPage from "../Page/Public/Tallas/TallaPage";
import NuestraPage from "../Page/Public/Informacion/NuestraPage";
import FrecuentesPage from "../Page/Public/Informacion/FrecuentesPage";
import NoticiasPage from "../Page/Public/Informacion/NoticiasPage";
import TerminosPage from "../Page/Public/Informacion/TerminosPage";
import DevolucionPage from "../Page/Public/Informacion/DevolucionPage";
import CarroPrincipal from "../Page/Public/Cart/CarroPrincipal";
import CheckoutLogin from "../Page/Public/Checkout/CheckoutLogin";
import CheckoutCart from "../Page/Public/Checkout/CheckoutCart";
import CheckoutDelivery from "../Page/Public/Checkout/CheckoutDelivery";
import CheckoutPayment from "../Page/Public/Checkout/CheckoutPayment";
import CartTotal from "../Page/Public/Checkout/CartTotal";
import ConfirmacionPedido from "../Page/Public/Checkout/ConfirmacionPedido"
import UnisexPage from "../Page/Public/Unisex/UnisexPage"

export const publicRoutesConfig = [
  // Productos visibles para invitados
  { path: "/hombre", element: MenPage , permisos:null},
  { path: "/mujer", element: WomenPage , permisos:null},
  { path: "/unisex", element: UnisexPage , permisos:null },
  { path: "/talla", element: TallaPage , permisos:null },
  { path: "/historia", element: NuestraPage, permisos:null },
  { path: "/pregunta", element: FrecuentesPage , permisos:null },
  { path: "/noticia", element: NoticiasPage , permisos:null },
  { path: "/terminos", element: TerminosPage , permisos: null },
  { path: "/devoluciones", element: DevolucionPage , permisos: null },
  { path: "/CarroPrincipal", element: CarroPrincipal , permisos: null },
  { path: "/checkoutLogin", element: CheckoutLogin , permisos: null }, 
  { path: "/checkoutCart", element: CheckoutCart , permisos: null },
  { path: "/checkoutDelivery", element: CheckoutDelivery , permisos: null },
  { path: "/checkoutPayment", element: CheckoutPayment , permisos: null },
  { path: "/cartTotal/:ordenId", element: CartTotal , permisos: null },
  { path: "/ordenDetallado", element: ConfirmacionPedido , permisos: null },


];
