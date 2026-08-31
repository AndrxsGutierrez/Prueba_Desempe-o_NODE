import { Request, Response } from "express";
import clinicService from "../services/clinic.service";

class ClinicController {
  async getClinics(_req: Request, res: Response): Promise<Response> {
    const clinics = await clinicService.getAll();
    return res.status(200).json(clinics);
  }

  async getClinic(req: Request, res: Response): Promise<Response> {
    const clinic = await clinicService.getById(Number(req.params.id));
    return res.status(200).json({ clinic });
  }

  async createClinic(req: Request, res: Response): Promise<Response> {
    const clinic = await clinicService.create(req.body);

    return res.status(201).json({
      message: "Clínica creada correctamente",
      clinic
    });
  }

  async updateClinic(req: Request, res: Response): Promise<Response> {
    const clinic = await clinicService.update(Number(req.params.id), req.body);

    return res.status(200).json({
      message: "Clínica actualizada correctamente",
      clinic
    });
  }

  async deleteClinic(req: Request, res: Response): Promise<Response> {
    await clinicService.delete(Number(req.params.id));
    return res.status(204).send();
  }
}

export default new ClinicController();