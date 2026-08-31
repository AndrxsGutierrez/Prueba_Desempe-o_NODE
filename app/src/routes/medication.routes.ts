import { Router } from "express";
import medicationController from "../controllers/medication.controller";
import { createMedicationSchema } from "../dto/create-medication.dto";
import { resourceIdParamSchema } from "../dto/resource-id-param.dto";
import { updateMedicationSchema } from "../dto/update-medication.dto";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateBody, validateParams } from "../middlewares/validate-body.middleware";

/** ADMIN-only routes for the medication catalog. */
const router = Router();

router.use(authenticateToken, authorizeRoles("ADMIN"));

/**
 * @swagger
 * /api/medications:
 *   get:
 *     summary: List active medications
 *     tags: [Medications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Medications retrieved successfully
 */
router.get("/", medicationController.getMedications);

/**
 * @swagger
 * /api/medications:
 *   post:
 *     summary: Create a medication
 *     tags: [Medications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Acetaminophen 500 mg
 *               description:
 *                 type: string
 *                 example: Analgesic and antipyretic medication
 *     responses:
 *       201:
 *         description: Medication created successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: A medication with this name already exists
 */
router.post("/", validateBody(createMedicationSchema), medicationController.createMedication);

/**
 * @swagger
 * /api/medications/{id}:
 *   get:
 *     summary: Get a medication by ID
 *     tags: [Medications]
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
 *         description: Medication retrieved successfully
 *       404:
 *         description: Medication not found
 */
router.get("/:id", validateParams(resourceIdParamSchema), medicationController.getMedication);

/**
 * @swagger
 * /api/medications/{id}:
 *   patch:
 *     summary: Update a medication
 *     tags: [Medications]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medication updated successfully
 *       404:
 *         description: Medication not found
 *       409:
 *         description: A medication with this name already exists
 */
router.patch(
  "/:id",
  validateParams(resourceIdParamSchema),
  validateBody(updateMedicationSchema),
  medicationController.updateMedication
);

/**
 * @swagger
 * /api/medications/{id}:
 *   delete:
 *     summary: Logically delete a medication
 *     tags: [Medications]
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
 *         description: Medication deleted successfully
 *       404:
 *         description: Medication not found
 */
router.delete("/:id", validateParams(resourceIdParamSchema), medicationController.deleteMedication);

export default router;
