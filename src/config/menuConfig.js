// src/config/menuConfig.js
const MenuConfig = [
  {
    id: 1,
    name: "Inicio",
    link: "/"
  },
  {
    id: 2,
    name: "Ropa",
    subLinks: [
      { id: 21, name: "Hombre", link: "/hombre"},
      { id: 22, name: "Mujer", link: "/mujer"},
      { id: 23, name: "Unisex", link:"/unisex"}
    ]
  },
  {
    id: 5,
    name: "Guia de Talla",
    link: "/talla"
  },
  {
    id: 6,
    name: "Admin",
    link: "/plataformaAdmin",
    permisos: "Admin.Ver",

  }
];

export default MenuConfig;
