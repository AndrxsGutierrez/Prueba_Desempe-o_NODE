
module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST || "db",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    dialect: "postgres",
    logging: false
  }
};