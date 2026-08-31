import { Router } from "express";
import authController from "../controllers/auth.controller";
import { createUserSchema } from "../dto/register-user.dto";
import { validateBody } from "../middlewares/validate-body.middleware";
import { loginUserSchema } from "../dto/login-user.dto";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Andrés
 *               lastName:
 *                 type: string
 *                 example: Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: andres@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: ClaveSegura123
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El correo ya está registrado
 */
router.post(
  "/register",
  validateBody(createUserSchema),
  authController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: andres@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: ClaveSegura123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso; devuelve un JWT.
 *       400:
 *         description: Datos de entrada inválidos.
 *       401:
 *         description: Correo o contraseña incorrectos.
 */
router.post(
  "/login",
  validateBody(loginUserSchema),
  authController.login
);

export default router;
