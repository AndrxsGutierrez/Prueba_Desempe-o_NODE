import { Request, Response } from "express";
import seedImportService from "../services/seed-import.service";

/** Handles JSON seed file uploads sent by an administrator. */
class SeedImportController {
  async importSeed(req: Request, res: Response): Promise<Response> {
    const summary = await seedImportService.import(req.file);

    return res.status(201).json({
      message: "Datos importados correctamente",
      summary
    });
  }
}

export default new SeedImportController();
