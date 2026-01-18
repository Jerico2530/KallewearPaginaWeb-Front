# 👕 KalleWear – Frontend Web

Frontend de **KalleWear**, e-commerce de **ropa urbana y juvenil**, desarrollado con **React 18**, **Tailwind CSS** y **React Query**.  
Diseñado para mostrar **buenas prácticas de arquitectura frontend, modularidad y escalabilidad**.

Este proyecto forma parte de mi portafolio profesional, demostrando:

- Estructura clara y modular  
- Integración con API mediante Axios  
- Manejo de estado global con Zustand  
- Validaciones con React Hook Form y Yup  
- Funcionalidades avanzadas: filtrado de productos, carrito, banners dinámicos y panel de administración  

---

## 🚀 Visión General

La aplicación permite a los usuarios:

- Explorar y filtrar productos (chompas, casacas, polos)  
- Agregar productos al carrito y gestionar pedidos  
- Administrar descuentos y anuncios (panel admin)  
- Interactuar con la API de manera segura y eficiente  

Incluye un **panel administrativo completo** para gestionar operaciones internas de forma centralizada.

---

## 🛠 Stack Tecnológico

- React 18 + Vite  
- Tailwind CSS  
- React Router DOM  
- Zustand (estado global)  
- React Hook Form + Yup (formularios y validaciones)  
- Axios (consumo de API)  
- React Query (caching y consultas asincrónicas)  
- Material UI / Emotion (componentes y estilos)  
- Framer Motion (animaciones)  
- Swiper / React Slick (carruseles)  
- Notistack / Sonner / React Toastify (notificaciones)  

---

## 📦 Dependencias Principales

### 🔹 Ruteo y Navegación
- `react-router-dom` – Rutas y navegación entre páginas  

### 🔹 Estado y Datos
- `zustand` – Estado global  
- `@tanstack/react-query` – Manejo de queries y caché  
- `axios` – Cliente HTTP para consumir la API  

### 🔹 Formularios y Validaciones
- `react-hook-form` – Formularios reactivos  
- `@hookform/resolvers` + `yup` – Validación de esquemas  

### 🔹 UI y Estilos
- `@mui/material`, `@emotion/react`, `@emotion/styled` – Componentes y estilos  
- `react-icons`, `lucide-react` – Iconos vectoriales  
- `react-slick`, `swiper` – Carruseles  
- `aos`, `framer-motion`, `react-wavify`, `react-top-loading-bar` – Animaciones y efectos  

### 🔹 Notificaciones
- `react-toastify`, `notistack`, `sonner` – Mensajes y alertas  

### 🔹 Dev Tools
- Vite + plugin React  
- TailwindCSS + PostCSS  
- ESLint + plugins React y Hooks  
- Swagger Typescript API (generación de clientes TS)  

---

## 🏗 Estructura del Proyecto

La estructura del frontend de **KalleWear** está organizada para **modularidad, escalabilidad y claridad**, separando componentes, hooks, páginas y estado global.  

src/
├── 🖼 assets/ # Imágenes, íconos, fuentes y recursos estáticos
├── 🌐 api/ # Configuración Axios y servicios de API
│ └── axiosClient.js
├── ⚛ components/ # Componentes reutilizables
│ ├── 🏗 Layout/ # Navbar, Sidebar, Footer
│ ├── 🔗 Shared/ # Componentes compartidos: Banner, DataLoader, Loader, Modal
│ └── 🎨 UI/ # Botones, Inputs, Cards, Dropdowns
├── ✨ features/ # Funcionalidades específicas: filtros, categorías, búsqueda
├── 🪝 hooks/ # Hooks personalizados para consumir API y lógica reactiva
├── 📄 pages/ # Páginas completas
│ ├── 🌍 Public/ # Carrito, Checkout, Landing Page, Productos
│ └── 🛠 Admin/ # Panel administrativo: CRUD anuncios, descuentos, productos
├── 🏪 store/ # Zustand stores para estado global
└── 🧰 utils/ # Funciones utilitarias: formateo de fechas, manejo de errores

---

## ✨ Funcionalidades Destacadas

### 🌍 Public
- **Carrito de Compras:** agregar, eliminar y modificar productos con cálculo automático del total.  
- **Filtros Dinámicos por Categoría:** animaciones fluidas y control de estado global.  
- **Banners Promocionales:** despliegue de descuentos activos con fechas e imágenes dinámicas.  
- **Responsive & Dark Mode:** diseño adaptable a cualquier dispositivo y soporte para modo oscuro.

### 🛠 Admin
- **CRUD de Anuncios:** creación, edición, eliminación y exportación a Excel de manera intuitiva.  
- **Formularios Profesionales:** validación inmediata con feedback visual.  
- **Notificaciones Inteligentes:** confirmaciones, errores y alertas en tiempo real.  
- **React Query:** gestión de caché y sincronización automática de datos con backend.

---

## 🔄 Flujo de Datos

Frontend React
│
▼
Axios + React Query
│
▼
Backend API (REST)


- **Consultas (`useQuery`)**: obtención de datos como anuncios, carrito y descuentos.  
- **Mutaciones (`useMutation`)**: crear, actualizar o eliminar recursos en la base de datos.  
- **Caché y sincronización:** React Query mantiene las listas actualizadas tras cualquier cambio.  
- **Estado Global:** Zustand maneja información persistente como usuario, carrito y filtros.

---

## 🏆 Buenas Prácticas Implementadas

- Separación clara entre **UI y lógica** mediante hooks y componentes reutilizables.  
- Uso de **React Query** para optimizar rendimiento y sincronización de datos.  
- **Validaciones robustas** con React Hook Form + Yup y feedback inmediato.  
- **Animaciones y efectos** con Framer Motion y AOS para mejor experiencia de usuario.  
- **Accesibilidad:** roles, ARIA y elementos semánticos correctamente implementados.  
- **Código modular y escalable**, fácil de mantener y extender con nuevas funcionalidades.

---
## 🏃‍♂️ Cómo Ejecutar el Frontend de KalleWear

Sigue estos pasos para configurar y ejecutar el frontend en tu máquina local.

---

### 📝 Requisitos

- Node.js (>=18.x) y npm (o yarn)  
- Visual Studio Code u otro editor de tu preferencia  
- Acceso al backend de KalleWear (ApiRopa) corriendo localmente o en servidor remoto  
- Git para clonar el repositorio

---

### 1️⃣ Clonar el repositorio, instalar dependencias y configurar variables

Abre tu terminal y ejecuta:


git clone https://github.com/tu-usuario/KalleWearFrontend.git
cd KalleWearFrontend

# Instalar dependencias
npm install
# o con yarn
yarn install

# Configurar variables de entorno
cp .env.example .env

# Usando npm
npm run dev

# o usando yarn
yarn dev






