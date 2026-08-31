# RiwiMediCare Plus API

A REST API for managing clinics, warehouses, medications, inventory, and supply requests. It includes JWT authentication, role-based access control, Swagger documentation, JSON data import with Multer, and test seeders.

## Coder Information

- **Name:** Andrés Gutiérrez
- **Clan:** Cohort 5
- **Public Repository:** [Prueba_Desempe-o_NODE](https://github.com/AndrxsGutierrez/Prueba_Desempe-o_NODE)

## Technologies Used

- Node.js
- TypeScript
- Express 5
- PostgreSQL 15
- Sequelize and Sequelize CLI
- JSON Web Token (JWT)
- bcrypt
- Zod
- Multer
- Swagger / OpenAPI
- Jest
- Docker and Docker Compose

## Main Features

- User registration, login, and JWT authentication.
- `ADMIN` and `USER` roles.
- CRUD operations with logical deletion for users, clinics, warehouses, medications, and inventory.
- Supply request management and request history by clinic.
- Available inventory validation when creating and approving requests.
- Interactive Swagger documentation.
- Clinic, warehouse, medication, and inventory import from a JSON file using Multer.

## Project Structure

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

## Prerequisites

- Docker
- Docker Compose

## Environment Variables

Create a `.env` file in the project root using the following example:

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

> Keep `POSTGRES_PORT=5432`. This value is used by the API to connect to the database service inside Docker Compose.

## Installation and Execution with Docker

From the project root, run:

```bash
docker compose up -d --build
```

To check the containers:

```bash
docker compose ps
```

To view API logs:

```bash
docker compose logs -f app
```

The API will be available at:

```text
http://localhost:3000
```

Docker installs Node.js and project dependencies inside the container, so Node.js and npm do not need to be installed on your machine.

To build or run tests with Docker:

```bash
docker compose exec -T app npm run build
docker compose exec -T app npm test
```

## API Documentation

With the application running, open:

```text
http://localhost:3000/api/docs/
```

Health check endpoint:

```text
GET /health
```

## Test Users

After running the role and user seeders, you can log in with:

```text
Email: admin@example.com
Password: Admin123*
```

## Running Test Seeders

Start the application at least once so Sequelize can create the tables. Then, from the project root, run the seeders inside the container:

```bash
docker compose exec -T app npx sequelize-cli db:seed --seed 20260829233711-default-roles.js
docker compose exec -T app npx sequelize-cli db:seed --seed 20260831140000-default-users.js
docker compose exec -T app npx sequelize-cli db:seed --seed 20260831160000-default-clinics.js
docker compose exec -T app npx sequelize-cli db:seed --seed 20260831150000-default-inventory.js
docker compose exec -T app npx sequelize-cli db:seed --seed 20260831170000-default-supply-requests.js
```

## JSON Data Import with Multer

The required data import endpoint is:

```text
POST /api/import/seed
```

Requirements:

- Requires a JWT from an `ADMIN` user.
- The request must use `multipart/form-data`.
- The file field must be named `file`.
- The uploaded file must use the `.json` extension.

You can use [seed-data.example.json](app/seed-data.example.json) as a test file. It contains clinics, warehouses, medications, and inventory data different from the conventional seeders.

You can also import the data from Swagger:

1. Log in as an administrator.
2. Copy the returned JWT token.
3. Open `/api/docs/` and select **Authorize**.
4. Enter `Bearer <your_token>`.
5. Execute `POST /api/import/seed` and attach the JSON file in the `file` field.

## Database Backup

The `backup-postgresql.sql` file contains a PostgreSQL backup for the final delivery. Since `.sql` files are ignored by Git, include it manually in the `.zip` file submitted to Moodle.
