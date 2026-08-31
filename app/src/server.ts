import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import userRoutes from "./routes/user.routes"
import authRoutes from "./routes/auth.routes"
import clinicRoutes from "./routes/clinic.routes";
import { errorHandler } from "./middlewares/error-handler.middleware";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    message: "API funcionando correctamente"
  });
});

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/clinics", clinicRoutes);

// Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(errorHandler);

export default app;
