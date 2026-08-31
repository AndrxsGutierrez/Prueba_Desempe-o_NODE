import { Router } from "express";
import clinicController from "../controllers/clinic.controller";
import { createClinicSchema } from "../dto/create-clinic.dto";
import { clinicIdParamSchema } from "../dto/clinic-id-param.dto";
import { updateClinicSchema } from "../dto/update-clinic.dto";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateBody, validateParams } from "../middlewares/validate-body.middleware";

const router = Router();

router.use(authenticateToken, authorizeRoles("ADMIN"));

/**
 * @swagger
 * /api/clinics:
 *   get:
 *     summary: List all active clinics
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active clinics retrieved successfully
 *       401:
 *         description: Authentication token is required, invalid, or expired
 *       403:
 *         description: ADMIN role is required
 */
router.get("/", clinicController.getClinics);

/**
 * @swagger
 * /api/clinics:
 *   post:
 *     summary: Create a clinic
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, nit, address, phone, responsibleName, responsibleEmail]
 *             properties:
 *               name:
 *                 type: string
 *                 example: RiwiMediCare Central Clinic
 *               nit:
 *                 type: string
 *                 example: 900123456-7
 *               address:
 *                 type: string
 *                 example: Calle 10 # 20-30
 *               phone:
 *                 type: string
 *                 example: +57 300 123 4567
 *               responsibleName:
 *                 type: string
 *                 example: Ana Pérez
 *               responsibleEmail:
 *                 type: string
 *                 format: email
 *                 example: ana.perez@clinic.com
 *     responses:
 *       201:
 *         description: Clinic created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Authentication token is required, invalid, or expired
 *       403:
 *         description: ADMIN role is required
 *       409:
 *         description: A clinic with the NIT already exists
 */
router.post("/", validateBody(createClinicSchema), clinicController.createClinic);

/**
 * @swagger
 * /api/clinics/{id}:
 *   get:
 *     summary: Get a clinic by ID
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Clinic retrieved successfully
 *       400:
 *         description: Invalid clinic ID
 *       401:
 *         description: Authentication token is required, invalid, or expired
 *       403:
 *         description: ADMIN role is required
 *       404:
 *         description: Clinic not found
 *   patch:
 *     summary: Update a clinic
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *               nit:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               responsibleName:
 *                 type: string
 *               responsibleEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Clinic updated successfully
 *       400:
 *         description: Invalid clinic ID or input data
 *       401:
 *         description: Authentication token is required, invalid, or expired
 *       403:
 *         description: ADMIN role is required
 *       404:
 *         description: Clinic not found
 *       409:
 *         description: A clinic with the NIT already exists
 *   delete:
 *     summary: Logically delete a clinic
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       204:
 *         description: Clinic deleted successfully
 *       400:
 *         description: Invalid clinic ID
 *       401:
 *         description: Authentication token is required, invalid, or expired
 *       403:
 *         description: ADMIN role is required
 *       404:
 *         description: Clinic not found
 */
router.get("/:id", validateParams(clinicIdParamSchema), clinicController.getClinic);
router.patch(
  "/:id",
  validateParams(clinicIdParamSchema),
  validateBody(updateClinicSchema),
  clinicController.updateClinic
);
router.delete("/:id", validateParams(clinicIdParamSchema), clinicController.deleteClinic);

export default router;
