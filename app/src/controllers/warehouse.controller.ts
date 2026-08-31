import { Request, Response } from "express";
import warehouseService from "../services/warehouse.service";

/** Exposes warehouse management through the API. */
class WarehouseController {
  async getWarehouses(_req: Request, res: Response): Promise<Response> {
    return res.status(200).json(await warehouseService.getAll());
  }

  async getWarehouse(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({
      warehouse: await warehouseService.getById(Number(req.params.id))
    });
  }

  async createWarehouse(req: Request, res: Response): Promise<Response> {
    return res.status(201).json({
      message: "Almacén creado correctamente",
      warehouse: await warehouseService.create(req.body)
    });
  }

  async updateWarehouse(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({
      message: "Almacén actualizado correctamente",
      warehouse: await warehouseService.update(Number(req.params.id), req.body)
    });
  }

  async deleteWarehouse(req: Request, res: Response): Promise<Response> {
    await warehouseService.delete(Number(req.params.id));
    return res.status(204).send();
  }
}

export default new WarehouseController();
