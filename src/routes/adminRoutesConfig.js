// src/routes/adminRoutesConfig.js
import PerfilPage from "../Page/Admin/Perfil/PerfilPage";
import RolesPageAdmin from "../Page/Admin/Rol/RolesPage";
import UserRolesPageAdmin from "../Page/Admin/UserRol/UserRolesPage";
import ProductoTallasPageAdmin from "../Page/Admin/ProductoTalla/ProductoTallasPage";
import ProductoCategoriaPageAdmin from "../Page/Admin/ProductoCategoria/ProductoCategoriaPage";
import TallasPageAdmin from "../Page/Admin/Talla/TallasPage";
import DescuentosPageAdmin from "../Page/Admin/Descuento/DescuentoPage";
import MonedasPageAdmin from "../Page/Admin/Moneda/MonedasPage";
import CategoriasPageAdmin from "../Page/Admin/Categoria/CategoriasPage";
import TestimoniosPageAdmin from "../Page/Admin/Testimonio/TestimoniosPage";
import AnunciosPageAdmin from "../Page/Admin/Anuncio/AnunciosPage";
import HistoriasPageAdmin from "../Page/Admin/Historia/HistoriasPage";
import GenerosPageAdmin from "../Page/Admin/Genero/GenerosPage";
import NoticiasPageAdmin from "../Page/Admin/Noticia/NaticiasPage";
import UsuariosPageAdmin from "../Page/Admin/Usuario/UsuariosPage";
import ProductosPageAdmin from "../Page/Admin/Producto/ProductosPage";
import PageCrud from "../Page/Admin/Pagess/PageCrud";
import PermisosPageAdmin from "../Page/Admin/Permisos/Permiso"
import UserPermRolPageAdmin from "../Page/Admin/Permisos/PermisoRol"
import SucursalesPageAdmin from "../Page/Admin/Sucursal/SucursalPage";
import DireccionesPageAdmin from "../Page/Admin/Direccion/DireccionPage";
import TipoPagosPageAdmin from "../Page/Admin/TipoPago/TipoPage"
import MedioPagoPageAdmin from "../Page/Admin/MedioPago/MedioPago";
import PagoPageAdmin from "../Page/Admin/Pago/PagoPage";
import CarritoComprasPageAdmin from "../Page/Admin/CarritoCompra/CarritoCompraPage";
import OrdenesPageAdmin from "../Page/Admin/Orden/OrdenPage";
import OrdenDetallesPageAdmin from "../Page/Admin/OrdenDetalle/OrdenDetallePage";

import { Children } from "react";

export const adminRoutesConfig = [
  { path: "/plataformaAdmin", element: PageCrud , permisos: ["Page.Ver"]},
  { path: "/perfilAdmin", element: PerfilPage , permisos: ["Perfil.Ver"]},
  { path: "/usuariosadmin", element: UsuariosPageAdmin , permisos: ["Usuario.Ver", "Usuario.VerDetalle", "Usuario.Crear", "Usuario.Eliminar ", "Usuario.Actualizar", "Usuario.ActualizarParcial"] },
  { path: "/rolesadmin", element:  RolesPageAdmin , permisos: ["Rol.Ver", "Rol.VerDetalle", "Rol.Crear", "Rol.Eliminar", "Rol.Actualizar", "Rol.ActualizarParcial"] },
  { path: "/usuariorolesadmin", element: UserRolesPageAdmin , permisos: ["UserRol.Ver", "UserRol.VerDetalle", "UserRol.Crear", "UserRol.Eliminar", "UserRol.Actualizar", "UserRol.ActualizarParcial "] },
  { path: "/productotaadmin", element: ProductosPageAdmin , permisos: ["Producto.Ver", "Producto.VerDetalle", "Producto.Crear", "Producto.Eliminar", "Producto.Actualizar", "Producto.ActualizarParcial"] },
  { path: "/productotallaadmin", element: ProductoTallasPageAdmin , permisos: ["ProductoTalla.Ver", "ProductoTalla.VerDetalle", "ProductoTalla.Crear", "ProductoTalla.Eliminar", "ProductoTalla.Actualizar", "ProductoTalla.ActualizarParcial"] },
  { path: "/productocategoriaadmin", element: ProductoCategoriaPageAdmin , permisos: ["ProductoCategoria.Ver", "ProductoCategoria.VerDetalle", "ProductoCategoria.Crear", "ProductoCategoria.Eliminar ", "ProductoCategoria.Actualizar", "ProductoCategoria.ActualizarParcial"] },
  { path: "/tallasadmin", element: TallasPageAdmin , permisos: ["Descuento.Ver", "Descuento.VerDetalle", "Descuento.Crear", "Descuento.Eliminar", "Descuento.Actualizar", "Descuento.ActualizarParcial "] },
  { path: "/descuentosadmin", element: DescuentosPageAdmin , permisos: [" Talla.Ver", "Talla.VerDetalle", "Talla.Crear", "Talla.Eliminar", "Talla.Actualizar", "Talla.ActualizarParcial"] },
  { path: "/monedasadmin", element: MonedasPageAdmin , permisos: ["Moneda.Ver", "Moneda.VerDetalle", "Moneda.Crear", "Moneda.Eliminar", "Moneda.Actualizar", "Moneda.ActualizarParcial"] },
  { path: "/categoriasadmin", element: CategoriasPageAdmin , permisos: [" Categoria.Ver ", "Categoria.VerDetalle", "Categoria.Crear", "Categoria.Eliminar", "Categoria.Actualizar", "Categoria.ActualizarParcial" ] },
  { path: "/testimoniosadmin", element: TestimoniosPageAdmin , permisos: ["Testimonio.Ver", "Testimonio.VerDetalle ", "Testimonio.Crear ", "Testimonio.Eliminar", "Testimonio.Actualizar", "Testimonio.ActualizarParcial"] },
  { path: "/anunciosadmin", element: AnunciosPageAdmin , permisos: ["Anuncio.Ver", "Anuncio.VerDetalle ", "Anuncio.Crear" , "Anuncio.Eliminar", "Anuncio.Actualizar", "Anuncio.ActualizarParcial"] },
  { path: "/noticiaadmin", element:  NoticiasPageAdmin , permisos: ["Noticia.Ver", "Noticia.VerDetalle", "Noticia.Crear", "Noticia.Eliminar", "Noticia.Actualizar", "Noticia.ActualizarParcial "] },
  { path: "/historiasadmin", element: HistoriasPageAdmin , permisos: ["Historia.Ver", "Historia.VerDetalle", "Historia.Crear", "Historia.Eliminar", "Historia.Actualizar", "Historia.ActualizarParcial"] },
  { path: "/generosadmin", element:  GenerosPageAdmin , permisos: [" Genero.Ver", "Genero.VerDetalle", "Genero.Crear", "Genero.Eliminar", "Genero.Actualizar", "Genero.ActualizarParcial"] },
  { path: "/permisoadmin", element:  PermisosPageAdmin , permisos: [" Permiso.Ver", "Permiso.VerDetalle", "Permiso.Crear", "Permiso.Eliminar", "Permiso.Actualizar", "Permiso.ActualizarParcial"] },
  { path: "/permisosroladmin", element:  UserPermRolPageAdmin , permisos: [" PermRol.Ver", "PermRol.VerDetalle", "PermRol.Crear", "PermRol.Eliminar", "PermRol.Actualizar", "PermRol.ActualizarParcial"] },
  { path: "/sucursaladmin", element:  SucursalesPageAdmin , permisos: [" Sucursal.Ver", "Sucursal.VerDetalle", "Sucursal.Crear", "Sucursal.Eliminar", "Sucursal.Actualizar", "Sucursal.ActualizarParcial"] },
  { path: "/direccionadmin", element:  DireccionesPageAdmin , permisos: [" Direccion.Ver", "Direccion.VerDetalle", "Direccion.Crear", "Direccion.Eliminar", "Direccion.Actualizar", "Direccion.ActualizarParcial"] },
  { path: "/tipoPagoadmin", element:  TipoPagosPageAdmin , permisos: [" TipoPago.Ver", "TipoPago.VerDetalle", "TipoPago.Crear", "TipoPago.Eliminar", "TipoPago.Actualizar", "TipoPago.ActualizarParcial"] },
  { path: "/medioPagoadmin", element:  MedioPagoPageAdmin , permisos: [" MedioPago.Ver", "MedioPago.VerDetalle", "MedioPago.Crear", "MedioPago.Eliminar", "MedioPago.Actualizar", "MedioPago.ActualizarParcial"] },
  { path: "/pagoadmin", element:  PagoPageAdmin , permisos: [" Pago.Ver", "Pago.VerDetalle", "Pago.Crear", "Pago.Eliminar", "Pago.Actualizar", "Pago.ActualizarParcial"] },
  { path: "/carritoCompraadmin", element:  CarritoComprasPageAdmin , permisos: [" Pago.CarritoCompra", "CarritoCompra.VerDetalle", "CarritoCompra.Crear", "CarritoCompra.Eliminar", "CarritoCompra.Actualizar", "CarritoCompra.ActualizarParcial"] },
  { path: "/ordentalleadmin", element:  OrdenDetallesPageAdmin , permisos: [" OrdenDetalle.CarritoCompra", "OrdenDetalle.VerDetalle", "OrdenDetalle.Crear", "OrdenDetalle.Eliminar", "OrdenDetalle.Actualizar", "OrdenDetalle.ActualizarParcial"] },
  { path: "/ordennadmin", element:  OrdenesPageAdmin , permisos: [" Orden.CarritoCompra", "Orden.VerDetalle", "Orden.Crear", "Orden.Eliminar", "Orden.Actualizar", "Orden.ActualizarParcial"] },



];
