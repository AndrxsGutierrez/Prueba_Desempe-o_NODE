import { Request, Response } from "express";
import medicationService from "../services/medication.service";

/** Exposes medication management through the API. */
class MedicationController {
  async getMedications(_req: Request, res: Response): Promise<Response> {
    return res.status(200).json(await medicationService.getAll());
  }

  async getMedication(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({
      medication: await medicationService.getById(Number(req.params.id))
    });
  }

  async createMedication(req: Request, res: Response): Promise<Response> {
    return res.status(201).json({
      message: "Medicamento creado correctamente",
      medication: await medicationService.create(req.body)
    });
  }

  async updateMedication(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({
      message: "Medicamento actualizado correctamente",
      medication: await medicationService.update(Number(req.params.id), req.body)
    });
  }

  async deleteMedication(req: Request, res: Response): Promise<Response> {
    await medicationService.delete(Number(req.params.id));
    return res.status(204).send();
  }
}

export default new MedicationController();
