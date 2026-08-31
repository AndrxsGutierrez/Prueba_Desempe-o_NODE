import { Router } from "express";
import supplyRequestController from "../controllers/supply-request.controller";
import { clinicHistoryParamSchema } from "../dto/clinic-history-param.dto";
import { createSupplyRequestSchema } from "../dto/create-supply-request.dto";
import { resourceIdParamSchema } from "../dto/resource-id-param.dto";
import { updateSupplyRequestStatusSchema } from "../dto/update-supply-request-status.dto";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { authorizeSupplyRequestStatusUpdate } from "../middlewares/supply-request-access.middleware";
import { validateBody, validateParams } from "../middlewares/validate-body.middleware";

/** Routes for the supply request workflow. */
const router = Router();

router.use(authenticateToken);

/**
 * @swagger
 * /api/supply-requests:
 *   get:
 *     summary: List active supply requests
 *     tags: [Supply Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supply requests retrieved successfully
 *       401:
 *         description: Authentication token is required, invalid, or expired
 */
router.get("/", supplyRequestController.getSupplyRequests);

/**
 * @swagger
 * /api/supply-requests:
 *   post:
 *     summary: Create a supply request
 *     tags: [Supply Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clinicId, warehouseId, medicationId, quantity]
 *             properties:
 *               clinicId:
 *                 type: integer
 *               warehouseId:
 *                 type: integer
 *               medicationId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Supply request created successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Clinic, warehouse, or medication not found
 *       409:
 *         description: Insufficient inventory
 */
router.post(
  "/",
  validateBody(createSupplyRequestSchema),
  supplyRequestController.createSupplyRequest
);

/**
 * @swagger
 * /api/supply-requests/history/clinic/{clinicId}:
 *   get:
 *     summary: Get supply request history for a clinic
 *     tags: [Supply Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Clinic history retrieved successfully
 *       404:
 *         description: Clinic not found
 */
router.get(
  "/history/clinic/:clinicId",
  validateParams(clinicHistoryParamSchema),
  supplyRequestController.getClinicHistory
);

/**
 * @swagger
 * /api/supply-requests/{id}:
 *   get:
 *     summary: Get a supply request by ID
 *     tags: [Supply Requests]
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
 *         description: Supply request retrieved successfully
 *       404:
 *         description: Supply request not found
 */
router.get("/:id", validateParams(resourceIdParamSchema), supplyRequestController.getSupplyRequest);

/**
 * @swagger
 * /api/supply-requests/{id}/status:
 *   patch:
 *     summary: Update a supply request status
 *     tags: [Supply Requests]
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED, COMPLETED]
 *     responses:
 *       200:
 *         description: Supply request status updated successfully
 *       400:
 *         description: Invalid status or status transition
 *       403:
 *         description: You cannot update this supply request
 *       404:
 *         description: Supply request not found
 *       409:
 *         description: Insufficient inventory for approval
 */
router.patch(
  "/:id/status",
  validateParams(resourceIdParamSchema),
  validateBody(updateSupplyRequestStatusSchema),
  authorizeSupplyRequestStatusUpdate,
  supplyRequestController.updateSupplyRequestStatus
);

/**
 * @swagger
 * /api/supply-requests/{id}:
 *   delete:
 *     summary: Logically delete a supply request
 *     tags: [Supply Requests]
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
 *         description: Supply request deleted successfully
 *       403:
 *         description: ADMIN role is required
 *       404:
 *         description: Supply request not found
 */
router.delete(
  "/:id",
  validateParams(resourceIdParamSchema),
  authorizeRoles("ADMIN"),
  supplyRequestController.deleteSupplyRequest
);

export default router;
