import Warehouse, { WarehouseCreationAttributes } from "../models/warehouse.model";

/** Contains only the database operations needed for warehouses. */
class WarehouseRepository {
  async findById(id: number): Promise<Warehouse | null> {
    return Warehouse.findOne({
      where: {
        id,
        isActive: true
      }
    });
  }

  async findByName(name: string): Promise<Warehouse | null> {
    return Warehouse.findOne({
      where: { name }
    });
  }

  async findAll(): Promise<Warehouse[]> {
    return Warehouse.findAll({
      where: { isActive: true }
    });
  }

  async create(data: WarehouseCreationAttributes): Promise<Warehouse> {
    return Warehouse.create(data);
  }

  async update(
    warehouse: Warehouse,
    data: Partial<WarehouseCreationAttributes>
  ): Promise<Warehouse> {
    return warehouse.update(data);
  }

  async deactivate(warehouse: Warehouse): Promise<Warehouse> {
    return warehouse.update({ isActive: false });
  }
}

export default new WarehouseRepository();
