import AppError from "../error/appError";
import type { WarehouseCreationAttributes } from "../models/warehouse.model";
import warehouseRepository from "../repositories/warehouse.repository";
import { CreateWarehouseDto } from "../dto/create-warehouse.dto";
import { UpdateWarehouseDto } from "../dto/update-warehouse.dto";
import { WarehouseResponseDto } from "../dto/warehouse-response.dto";

/** Applies warehouse business rules before changing persistent data. */
class WarehouseService {
  async getAll(): Promise<WarehouseResponseDto[]> {
    const warehouses = await warehouseRepository.findAll();
    return warehouses.map((warehouse) => this.toResponse(warehouse));
  }

  async getById(id: number): Promise<WarehouseResponseDto> {
    return this.toResponse(await this.getWarehouseOrFail(id));
  }

  async create(data: CreateWarehouseDto): Promise<WarehouseResponseDto> {
    const warehouseWithName = await warehouseRepository.findByName(data.name);

    if (warehouseWithName) {
      throw new AppError(409, "Ya existe un almacén con este nombre");
    }

    return this.toResponse(await warehouseRepository.create(data));
  }

  async update(id: number, data: UpdateWarehouseDto): Promise<WarehouseResponseDto> {
    const warehouse = await this.getWarehouseOrFail(id);

    if (data.name && data.name !== warehouse.name) {
      const warehouseWithName = await warehouseRepository.findByName(data.name);

      if (warehouseWithName) {
        throw new AppError(409, "Ya existe un almacén con este nombre");
      }
    }

    const updateData: Partial<WarehouseCreationAttributes> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.address !== undefined) updateData.address = data.address;

    return this.toResponse(await warehouseRepository.update(warehouse, updateData));
  }

  async delete(id: number): Promise<void> {
    await warehouseRepository.deactivate(await this.getWarehouseOrFail(id));
  }

  private async getWarehouseOrFail(id: number) {
    const warehouse = await warehouseRepository.findById(id);
    if (!warehouse) throw new AppError(404, "Almacén no encontrado");
    return warehouse;
  }

  private toResponse(warehouse: WarehouseResponseDto): WarehouseResponseDto {
    return {
      id: warehouse.id,
      name: warehouse.name,
      address: warehouse.address,
      isActive: warehouse.isActive
    };
  }
}

export default new WarehouseService();
