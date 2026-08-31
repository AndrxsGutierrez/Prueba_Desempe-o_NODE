# RiwiMediCare Plus API

API REST para gestionar clínicas, almacenes, medicamentos, inventario y solicitudes de abastecimiento. Incluye autenticación JWT, control de acceso por roles, documentación Swagger, carga de datos JSON con Multer y seeders de prueba.

## Información del coder

- **Nombre:** Andrés Gutiérrez
- **Clan:** Cohorte 5
- **Repositorio público:** [Prueba_Desempe-o_NODE](https://github.com/AndrxsGutierrez/Prueba_Desempe-o_NODE)

## Tecnologías utilizadas

- Node.js
- TypeScript
- Express 5
- PostgreSQL 15
- Sequelize y Sequelize CLI
- JSON Web Token (JWT)
- bcrypt
- Zod
- Multer
- Swagger / OpenAPI
- Jest
- Docker y Docker Compose

## Funcionalidades principales

- Registro, inicio de sesión y autenticación con JWT.
- Roles `ADMIN` y `USER`.
- CRUD con eliminación lógica para usuarios, clínicas, almacenes, medicamentos e inventario.
- Gestión de solicitudes de abastecimiento y su historial por clínica.
- Validación de inventario disponible al crear y aprobar solicitudes.
- Documentación interactiva en Swagger.
- Importación de clínicas, almacenes, medicamentos e inventario desde un archivo JSON mediante Multer.

## Estructura del proyecto

```text
.
├── app/
│   ├── src/
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── seeders/
│   │   └── services/
│   ├── seed-data.example.json
│   └── package.json
└── docker-compose.yml
```

## Requisitos previos

- Node.js 20 o superior.
- npm.
- Docker y Docker Compose.

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con una configuración similar a esta:

```env
NODE_ENV=development
APP_PORT=3000
APP_CONTAINER_NAME=auth-api
DB_CONTAINER_NAME=auth-db

POSTGRES_USER=postgres
POSTGRES_PASSWORD=change_this_password
POSTGRES_DB=riwi_medicare
POSTGRES_HOST=db
POSTGRES_PORT=5432

JWT_SECRET=replace_with_a_long_secure_secret
```

> Cuando ejecutes la aplicación fuera de Docker, usa `POSTGRES_HOST=localhost`.

## Instalación y ejecución con Docker

Desde la raíz del proyecto:

```bash
docker compose up -d --build
```

Para comprobar los contenedores:

```bash
docker compose ps
```

Para consultar los logs de la API:

```bash
docker compose logs -f app
```

La API estará disponible en:

```text
http://localhost:3000
```

## Instalación y ejecución local

Instala las dependencias dentro de `app`:

```bash
cd app
npm ci
```

Inicia la aplicación en modo desarrollo:

```bash
npm run dev
```

Otros comandos disponibles:

```bash
npm run build
npm start
npm test
```

## Documentación API

Con la aplicación en ejecución, abre:

```text
http://localhost:3000/api/docs/
```

El endpoint de salud es:

```text
GET /health
```

## Usuarios de prueba

Después de ejecutar los seeders de roles y usuarios, puedes iniciar sesión con:

```text
Email: admin@example.com
Password: Admin123*
```

## Ejecutar seeders de prueba

Primero levanta la aplicación al menos una vez para que Sequelize cree las tablas. Luego, desde la raíz del proyecto, ejecuta los seeders dentro del contenedor:

```bash
docker compose exec -T app npx sequelize-cli db:seed --seed 20260829233711-default-roles.js
docker compose exec -T app npx sequelize-cli db:seed --seed 20260831140000-default-users.js
docker compose exec -T app npx sequelize-cli db:seed --seed 20260831160000-default-clinics.js
docker compose exec -T app npx sequelize-cli db:seed --seed 20260831150000-default-inventory.js
docker compose exec -T app npx sequelize-cli db:seed --seed 20260831170000-default-supply-requests.js
```

## Carga de datos JSON con Multer

El endpoint requerido para importar datos es:

```text
POST /api/import/seed
```

Requisitos:

- Requiere un JWT de usuario con rol `ADMIN`.
- Debe enviarse como `multipart/form-data`.
- El campo del archivo debe llamarse `file`.
- El archivo debe tener extensión `.json`.

Puedes usar [seed-data.example.json](app/seed-data.example.json) como archivo de prueba. Este contiene clínicas, almacenes, medicamentos e inventario con datos distintos a los seeders convencionales.

También puedes realizar la carga desde Swagger:

1. Inicia sesión con el administrador.
2. Copia el token JWT recibido.
3. Abre `/api/docs/` y selecciona **Authorize**.
4. Ingresa `Bearer <tu_token>`.
5. Ejecuta `POST /api/import/seed` y adjunta el archivo JSON en el campo `file`.

## Backup de base de datos

El archivo `backup-postgresql.sql` contiene un respaldo de PostgreSQL para la entrega final. Como los archivos `.sql` están ignorados por Git, debe incluirse manualmente en el archivo `.zip` que se entrega en Moodle.
