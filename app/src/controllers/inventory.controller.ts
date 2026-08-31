import { Request, Response } from "express";
import inventoryService from "../services/inventory.service";

/** Exposes inventory operations through the API. */
class InventoryController {
  async getInventories(_req: Request, res: Response): Promise<Response> {
    return res.status(200).json(await inventoryService.getAll());
  }

  async getInventory(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({
      inventory: await inventoryService.getById(Number(req.params.id))
    });
  }

  async createInventory(req: Request, res: Response): Promise<Response> {
    return res.status(201).json({
      message: "Inventario creado correctamente",
      inventory: await inventoryService.create(req.body)
    });
  }

  async updateInventory(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({
      message: "Inventario actualizado correctamente",
      inventory: await inventoryService.update(Number(req.params.id), req.body)
    });
  }

  async deleteInventory(req: Request, res: Response): Promise<Response> {
    await inventoryService.delete(Number(req.params.id));
    return res.status(204).send();
  }
}

export default new InventoryController();
