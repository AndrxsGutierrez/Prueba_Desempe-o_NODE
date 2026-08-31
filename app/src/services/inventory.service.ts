import { CreateInventoryDto } from "../dto/create-inventory.dto";
import { InventoryResponseDto } from "../dto/inventory-response.dto";
import { UpdateInventoryDto } from "../dto/update-inventory.dto";
import AppError from "../error/appError";
import inventoryRepository from "../repositories/inventory.repository";
import medicationRepository from "../repositories/medication.repository";
import warehouseRepository from "../repositories/warehouse.repository";

/** Coordinates stock rules across warehouses and medications. */
class InventoryService {
  async getAll(): Promise<InventoryResponseDto[]> {
    const inventories = await inventoryRepository.findAll();
    return inventories.map((inventory) => this.toResponse(inventory));
  }

  async getById(id: number): Promise<InventoryResponseDto> {
    return this.toResponse(await this.getInventoryOrFail(id));
  }

  async create(data: CreateInventoryDto): Promise<InventoryResponseDto> {
    const [warehouse, medication, existingInventory] = await Promise.all([
      warehouseRepository.findById(data.warehouseId),
      medicationRepository.findById(data.medicationId),
      inventoryRepository.findByWarehouseAndMedication(data.warehouseId, data.medicationId)
    ]);

    if (!warehouse) throw new AppError(404, "Almacén no encontrado");
    if (!medication) throw new AppError(404, "Medicamento no encontrado");

    if (existingInventory?.isActive) {
      throw new AppError(409, "El medicamento ya está registrado en este almacén");
    }

    if (existingInventory) {
      return this.toResponse(await inventoryRepository.update(existingInventory, {
        quantity: data.quantity,
        isActive: true
      }));
    }

    return this.toResponse(await inventoryRepository.create(data));
  }

  async update(id: number, data: UpdateInventoryDto): Promise<InventoryResponseDto> {
    const inventory = await this.getInventoryOrFail(id);
    return this.toResponse(await inventoryRepository.update(inventory, data));
  }

  async delete(id: number): Promise<void> {
    await inventoryRepository.deactivate(await this.getInventoryOrFail(id));
  }

  private async getInventoryOrFail(id: number) {
    const inventory = await inventoryRepository.findById(id);
    if (!inventory) throw new AppError(404, "Inventario no encontrado");
    return inventory;
  }

  private toResponse(inventory: InventoryResponseDto): InventoryResponseDto {
    return {
      id: inventory.id,
      warehouseId: inventory.warehouseId,
      medicationId: inventory.medicationId,
      quantity: inventory.quantity,
      isActive: inventory.isActive
    };
  }
}

export default new InventoryService();
