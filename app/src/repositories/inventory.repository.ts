import Inventory, { InventoryCreationAttributes } from "../models/inventory.model";

/** Contains only the database operations needed for inventory records. */
class InventoryRepository {
  async findById(id: number): Promise<Inventory | null> {
    return Inventory.findOne({
      where: {
        id,
        isActive: true
      }
    });
  }

  async findByWarehouseAndMedication(
    warehouseId: number,
    medicationId: number
  ): Promise<Inventory | null> {
    return Inventory.findOne({
      where: {
        warehouseId,
        medicationId
      }
    });
  }

  async findAll(): Promise<Inventory[]> {
    return Inventory.findAll({
      where: { isActive: true }
    });
  }

  async create(data: InventoryCreationAttributes): Promise<Inventory> {
    return Inventory.create(data);
  }

  async update(
    inventory: Inventory,
    data: Partial<InventoryCreationAttributes>
  ): Promise<Inventory> {
    return inventory.update(data);
  }

  async deactivate(inventory: Inventory): Promise<Inventory> {
    return inventory.update({ isActive: false });
  }
}

export default new InventoryRepository();
