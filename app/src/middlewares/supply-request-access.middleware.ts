import { NextFunction, Response } from "express";
import AppError from "../error/appError";
import supplyRequestRepository from "../repositories/supply-request.repository";
import { AuthRequest } from "./auth.middleware";

/** Lets the request creator or an ADMIN update its status. */
export async function authorizeSupplyRequestStatusUpdate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.user?.role === "ADMIN") {
      next();
      return;
    }

    const supplyRequest = await supplyRequestRepository.findById(Number(req.params.id));

    if (!supplyRequest) {
      throw new AppError(404, "Solicitud no encontrada");
    }

    if (req.user?.userId !== supplyRequest.createdByUserId) {
      throw new AppError(403, "No tienes permiso para actualizar esta solicitud");
    }

    next();
  } catch (error) {
    next(error);
  }
}
