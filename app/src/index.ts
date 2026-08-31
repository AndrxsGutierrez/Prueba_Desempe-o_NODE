import "dotenv/config";
import { app } from "./server";
import sequelize from "./config/database";
import "./models/associations"

const port = Number(process.env.APP_PORT) || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conexion a la base de datos exitosa");

    await sequelize.sync({
      alter: true
    })

    app.listen(port, () => {
      console.log(`API ejecutandose en http://localhost:${port}`);
    });

  } catch (error) {
    console.error("No fue posible conectar con la base de datos:", error);
    process.exit(1)
  }
}

startServer()

