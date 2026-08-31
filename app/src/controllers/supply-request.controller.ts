import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import supplyRequestService from "../services/supply-request.service";

/** Exposes supply request operations through the API. */
class SupplyRequestController {
  async getSupplyRequests(_req: AuthRequest, res: Response): Promise<Response> {
    return res.status(200).json(await supplyRequestService.getAll());
  }

  async getSupplyRequest(req: AuthRequest, res: Response): Promise<Response> {
    return res.status(200).json({
      supplyRequest: await supplyRequestService.getById(Number(req.params.id))
    });
  }

  async getClinicHistory(req: AuthRequest, res: Response): Promise<Response> {
    return res.status(200).json({
      supplyRequests: await supplyRequestService.getHistoryByClinic(Number(req.params.clinicId))
    });
  }

  async createSupplyRequest(req: AuthRequest, res: Response): Promise<Response> {
    return res.status(201).json({
      message: "Solicitud creada correctamente",
      supplyRequest: await supplyRequestService.create(req.body, Number(req.user?.userId))
    });
  }

  async updateSupplyRequestStatus(req: AuthRequest, res: Response): Promise<Response> {
    return res.status(200).json({
      message: "Estado de la solicitud actualizado correctamente",
      supplyRequest: await supplyRequestService.updateStatus(Number(req.params.id), req.body)
    });
  }

  async deleteSupplyRequest(req: AuthRequest, res: Response): Promise<Response> {
    await supplyRequestService.delete(Number(req.params.id));
    return res.status(204).send();
  }
}

export default new SupplyRequestController();
