import { Router } from "express";
import warehouseController from "../controllers/warehouse.controller";
import { resourceIdParamSchema } from "../dto/resource-id-param.dto";
import { createWarehouseSchema } from "../dto/create-warehouse.dto";
import { updateWarehouseSchema } from "../dto/update-warehouse.dto";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateBody, validateParams } from "../middlewares/validate-body.middleware";

/** ADMIN-only routes for warehouse management. */
const router = Router();

router.use(authenticateToken, authorizeRoles("ADMIN"));

/**
 * @swagger
 * /api/warehouses:
 *   get:
 *     summary: List active warehouses
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Warehouses retrieved successfully
 *       401:
 *         description: Authentication token is required, invalid, or expired
 *       403:
 *         description: ADMIN role is required
 */
router.get("/", warehouseController.getWarehouses);

/**
 * @swagger
 * /api/warehouses:
 *   post:
 *     summary: Create a warehouse
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, address]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Central Warehouse
 *               address:
 *                 type: string
 *                 example: Calle 20 # 10-15
 *     responses:
 *       201:
 *         description: Warehouse created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Authentication token is required, invalid, or expired
 *       403:
 *         description: ADMIN role is required
 *       409:
 *         description: A warehouse with this name already exists
 */
router.post("/", validateBody(createWarehouseSchema), warehouseController.createWarehouse);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   get:
 *     summary: Get a warehouse by ID
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Warehouse retrieved successfully
 *       404:
 *         description: Warehouse not found
 */
router.get("/:id", validateParams(resourceIdParamSchema), warehouseController.getWarehouse);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   patch:
 *     summary: Update a warehouse
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Warehouse updated successfully
 *       404:
 *         description: Warehouse not found
 *       409:
 *         description: A warehouse with this name already exists
 */
router.patch(
  "/:id",
  validateParams(resourceIdParamSchema),
  validateBody(updateWarehouseSchema),
  warehouseController.updateWarehouse
);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   delete:
 *     summary: Logically delete a warehouse
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Warehouse deleted successfully
 *       404:
 *         description: Warehouse not found
 */
router.delete("/:id", validateParams(resourceIdParamSchema), warehouseController.deleteWarehouse);

export default router;
