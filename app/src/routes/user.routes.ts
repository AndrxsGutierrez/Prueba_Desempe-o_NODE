import { Router } from "express";
import userController from "../controllers/user.controller";
import { userIdParamSchema } from "../dto/user-id-param.dto";
import { updateUserSchema } from "../dto/update-user.dto";
import { authorizeRoles } from "../middlewares/role.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeUserMutation } from "../middlewares/user-access.middleware";
import { validateBody, validateParams } from "../middlewares/validate-body.middleware";

const router = Router();


/**
 * GET /
 * ----
 * Obtiene la lista completa de usuarios registrados en la base de datos.
 * 
 * Response:
 *  - 200 OK: Devuelve un array de usuarios en formato JSON.
 * 
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@example.com"
 *               - id: 2
 *                 firstName: "Jane"
 *                 lastName: "Doe"
 *                 email: "jane.doe@example.com"
 *       400:
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             example:
 *               error: "Parámetros incorrectos"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener los usuarios"
 */
router.get(
  "/", 
  authenticateToken,
  authorizeRoles("ADMIN"),
  userController.getUsers,
);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente
 *       401:
 *         description: Token requerido, inválido o vencido
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/profile", authenticateToken, userController.getProfile);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID (solo ADMIN)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario a consultar
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 id: 1
 *                 firstName: John
 *                 lastName: Doe
 *                 email: john.doe@example.com
 *                 roleId: 1
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token requerido, inválido o vencido
 *       403:
 *         description: Se requiere el rol ADMIN
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
  "/:id",
  authenticateToken,
  validateParams(userIdParamSchema),
  authorizeRoles("ADMIN"),
  userController.getUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Actualizar un usuario
 *     description: Un usuario normal solo puede actualizar su propia cuenta. ADMIN puede actualizar usuarios normales, pero no cuentas ADMIN ni su propia cuenta desde esta ruta.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: John
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.smith@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 72
 *                 example: NuevaClave123
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: Usuario actualizado correctamente
 *               user:
 *                 id: 1
 *                 firstName: John
 *                 lastName: Smith
 *                 email: john.smith@example.com
 *                 roleId: 1
 *       400:
 *         description: ID o datos de entrada inválidos
 *       401:
 *         description: Token requerido, inválido o vencido
 *       403:
 *         description: No tienes permisos para modificar este usuario
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: El correo ya está registrado
 */
router.patch(
  "/:id",
  authenticateToken,
  validateParams(userIdParamSchema),
  validateBody(updateUserSchema),
  authorizeUserMutation,
  userController.updateUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Un usuario normal solo puede eliminar su propia cuenta. ADMIN puede eliminar usuarios normales, pero no cuentas ADMIN ni su propia cuenta desde esta ruta.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario a eliminar
 *     responses:
 *       204:
 *         description: Usuario eliminado correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token requerido, inválido o vencido
 *       403:
 *         description: No tienes permisos para eliminar este usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.delete(
  "/:id",
  authenticateToken,
  validateParams(userIdParamSchema),
  authorizeUserMutation,
  userController.deleteUser
);

export default router;
