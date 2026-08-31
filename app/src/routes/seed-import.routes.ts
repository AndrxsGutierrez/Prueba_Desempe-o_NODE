import { Router } from "express";
import seedImportController from "../controllers/seed-import.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { uploadJson } from "../middlewares/upload.middleware";

/** ADMIN-only endpoint for loading an initial JSON dataset. */
const router = Router();

/**
 * @swagger
 * /api/import/seed:
 *   post:
 *     summary: Import clinics, warehouses, medications, and inventory from a JSON file
 *     tags: [Data Import]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Data imported successfully
 *       400:
 *         description: Missing, invalid, or malformed JSON file
 *       401:
 *         description: Authentication token is required, invalid, or expired
 *       403:
 *         description: ADMIN role is required
 */
router.post(
  "/seed",
  uploadJson.single("file"),
  seedImportController.importSeed
);

export default router;
