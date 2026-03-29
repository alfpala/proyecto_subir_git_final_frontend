# Admin Panel (React)

## Descripción
Este panel de administración permite gestionar usuarios, productos, categorías, favoritos y pedidos de la tienda. Está desarrollado en React y utiliza Bootstrap para el diseño visual.

## Funcionalidades principales
- Login de administrador
- Dashboard con métricas y accesos rápidos
- Gestión de usuarios (listar, crear, editar, eliminar)
- Gestión de productos (listar, crear, editar, eliminar)
- Gestión de categorías (listar, crear, editar, eliminar)
- Gestión de favoritos
- Gestión de pedidos (ver detalle, cambiar estado)
- Protección de rutas solo para administradores
- Feedback visual con toasts

## Estructura de carpetas
- `pages/` — Vistas principales del admin
- `components/` — Componentes reutilizables (Sidebar, etc.)
- `services/` — Lógica de acceso a la API
- `context/` — Contexto de autenticación admin
- `styles/` — Estilos CSS (incluye Bootstrap y custom)

## Requisitos
- Node.js 18+
- Backend corriendo en http://localhost:3000/api

## Instalación y ejecución
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Inicia el frontend:
   ```bash
   npm run dev
   ```

## Notas
- El acceso al panel requiere login de administrador.
- Los estados válidos para pedidos son: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`.
- El diseño se utiliza Bootstrap y estilos personalizados.

---
