// sidebarMenu.js
import {
  FaUser,
  FaUserShield,
  FaUserCog,
  FaTshirt,
  FaRulerVertical,
  FaRulerHorizontal,
  FaHeart,
  FaBoxOpen,
  FaLayerGroup,
  FaTag,
  FaCoins,
  FaKey,
  FaLockOpen,
  FaVenusMars,
  FaStore,
  FaMapMarkerAlt,
  FaWallet,
  FaCreditCard,
  FaListAlt,
  FaBullhorn,
  FaQuoteRight,
  FaNewspaper,
  FaHistory,
  FaCashRegister,
  FaShoppingCart,
  FaFileInvoice
} from "react-icons/fa";

export const sidebarMenu = [
  {
    title: "Gestión Usuario",
    icon: FaUser,
    children: [
      { label: "Usuario", path: "/usuariosadmin", icon: FaUser },
      { label: "Rol", path: "/rolesadmin", icon: FaUserShield },
      { label: "UsuarioRol", path: "/usuariorolesadmin", icon: FaUserCog },
    ],
  },
  {
    title: "Gestión Producto",
    icon: FaBoxOpen,
    children: [
      { label: "Producto", path: "/productotaadmin", icon: FaTshirt },
      {
        label: "ProductoTalla",
        path: "/productotallaadmin",
        icon: FaRulerVertical,
      },
      {
        label: "ProductoFavorito",
        path: "/productofavoritoadmin",
        icon: FaHeart,
      },
      {
        label: "ProductoCategoria",
        path: "/productocategoriaadmin",
        icon: FaLayerGroup,
      },
    ],
  },
  {
    title: "Gestión Permisos",
    icon: FaKey,
    children: [
      { label: "Permisos", path: "/permisoadmin", icon: FaKey },
      { label: "PermisosRol", path: "/permisosroladmin", icon: FaLockOpen },
    ],
  },
  {
    title: "Catálogos",
    icon: FaLayerGroup,
    children: [
      { label: "Talla", path: "/tallasadmin", icon: FaRulerHorizontal },
      { label: "Descuento", path: "/descuentosadmin", icon: FaTag },
      { label: "Moneda", path: "/monedasadmin", icon: FaCoins },
      { label: "Categoria", path: "/categoriasadmin", icon: FaLayerGroup },
      { label: "Género", path: "/generosadmin", icon: FaVenusMars },
    ],
  },
  {
    title: "Sucursales & Ubicaciones",
    icon: FaStore,
    children: [
      { label: "Sucursal", path: "/sucursaladmin", icon: FaStore },
      { label: "Direccion", path: "/direccionadmin", icon: FaMapMarkerAlt },
    ],
  },
  {
    title: "Pagos",
    icon: FaCreditCard,
    children: [
      { label: "Tipo Pago", path: "/tipoPagoadmin", icon: FaListAlt },
      { label: "Medio Pago", path: "/medioPagoadmin", icon: FaWallet },
      { label: "Pago", path: "/pagoadmin", icon: FaCreditCard },
    ],
  },
  {
    title: "Contenido & Marketing",
    icon: FaBullhorn,
    children: [
      { label: "Testimonio", path: "/testimoniosadmin", icon: FaQuoteRight },
      { label: "Publicidad", path: "/anunciosadmin", icon: FaBullhorn },
      { label: "Noticia", path: "/noticiaadmin", icon: FaNewspaper },
      { label: "Historia", path: "/historiasadmin", icon: FaHistory },
    ],
  },
  {
    title: "Venta",
    icon: FaCashRegister,
    children: [
      {
        label: "Carrito Compra",
        path: "/carritoCompraadmin",
        icon: FaShoppingCart,
      },
      { label: "Orden", path: "/ordennadmin", icon: FaFileInvoice },
      { label: "Orden Detalle", path: "/ordentalleadmin", icon: FaFileInvoice },
    ],
  },
];
