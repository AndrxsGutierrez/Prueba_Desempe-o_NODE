import { Router } from "express";
import inventoryController from "../controllers/inventory.controller";
import { createInventorySchema } from "../dto/create-inventory.dto";
import { resourceIdParamSchema } from "../dto/resource-id-param.dto";
import { updateInventorySchema } from "../dto/update-inventory.dto";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateBody, validateParams } from "../middlewares/validate-body.middleware";

/** ADMIN-only routes for medication stock management. */
const router = Router();

router.use(authenticateToken, authorizeRoles("ADMIN"));

/**
 * @swagger
 * /api/inventories:
 *   get:
 *     summary: List active inventory records
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory records retrieved successfully
 */
router.get("/", inventoryController.getInventories);

/**
 * @swagger
 * /api/inventories:
 *   post:
 *     summary: Add a medication to a warehouse inventory
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [warehouseId, medicationId, quantity]
 *             properties:
 *               warehouseId:
 *                 type: integer
 *                 example: 1
 *               medicationId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 example: 100
 *     responses:
 *       201:
 *         description: Inventory record created successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Warehouse or medication not found
 *       409:
 *         description: Medication is already registered in this warehouse
 */
router.post("/", validateBody(createInventorySchema), inventoryController.createInventory);

/**
 * @swagger
 * /api/inventories/{id}:
 *   get:
 *     summary: Get an inventory record by ID
 *     tags: [Inventory]
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
 *         description: Inventory record retrieved successfully
 *       404:
 *         description: Inventory record not found
 */
router.get("/:id", validateParams(resourceIdParamSchema), inventoryController.getInventory);

/**
 * @swagger
 * /api/inventories/{id}:
 *   patch:
 *     summary: Update an inventory quantity
 *     tags: [Inventory]
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
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Inventory record updated successfully
 *       404:
 *         description: Inventory record not found
 */
router.patch(
  "/:id",
  validateParams(resourceIdParamSchema),
  validateBody(updateInventorySchema),
  inventoryController.updateInventory
);

/**
 * @swagger
 * /api/inventories/{id}:
 *   delete:
 *     summary: Logically delete an inventory record
 *     tags: [Inventory]
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
 *         description: Inventory record deleted successfully
 *       404:
 *         description: Inventory record not found
 */
router.delete("/:id", validateParams(resourceIdParamSchema), inventoryController.deleteInventory);

export default router;
