# RevaGourmet

Sistema web full stack inspirado en Reva, adaptado a reservas de mesas en restaurantes de lujo.

## Tecnologias

- Frontend: React + Vite + React Router + Axios
- Backend: Node.js + Express
- Base de datos: SQLite
- ORM: Sequelize
- Autenticacion: JWT + bcryptjs
- API REST con arquitectura MVC

## Estructura

```txt
backend/
  src/
    config/
    controllers/
    models/
    routes/
    seeders/
    app.js
    server.js
frontend/
  src/
    components/
    pages/
    services/
```

## Instalacion

Desde la carpeta del proyecto:

```bash
cd backend
npm install
npm run dev
```

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Backend: http://localhost:4000

Frontend: http://localhost:5173

## Correos de reserva

Al confirmar una reserva, el backend envia un correo al usuario registrado y a `diegotoroaguilar@gmail.com`.

Para enviar correos reales, crea `backend/.env` tomando como base `backend/.env.example` y completa los datos SMTP. Con Gmail debes usar una contrasena de aplicacion, no tu contrasena normal.

## Usuarios de prueba

Administrador:

- Correo: admin@reservaprime.com
- Contrasena: admin123

Usuario:

- Correo: usuario@revagourmet.com
- Contrasena: usuario123

Propietario:

- Correo: propietario@revagourmet.com
- Contrasena: propietario123

## Funciones principales

- Ver restaurantes premium y sus sucursales.
- Registro, inicio de sesion, cierre de sesion y perfil.
- Buscar mesas por fecha, hora y cantidad de personas.
- Crear reservas solo con usuario autenticado.
- Cada usuario ve y cancela solo sus propias reservas.
- Los propietarios registran restaurantes, sucursales y mesas desde Panel Propietario.
- Los restaurantes de propietarios quedan pendientes hasta aprobacion del administrador.
- El administrador ve todas las reservas y gestiona restaurantes, sucursales y mesas.

La base de datos SQLite se crea automaticamente en `backend/database.sqlite` y se carga con datos de prueba al iniciar el backend.
