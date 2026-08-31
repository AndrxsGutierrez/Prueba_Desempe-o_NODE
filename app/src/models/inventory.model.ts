import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/** Persistent stock assigned to one medication in one warehouse. */
export interface InventoryAttributes {
  id: number;
  warehouseId: number;
  medicationId: number;
  quantity: number;
  isActive: boolean;
}

export interface InventoryCreationAttributes
  extends Optional<InventoryAttributes, "id" | "isActive"> {}

class Inventory
  extends Model<InventoryAttributes, InventoryCreationAttributes>
  implements InventoryAttributes {
  public id!: number;
  public warehouseId!: number;
  public medicationId!: number;
  public quantity!: number;
  public isActive!: boolean;
}

Inventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "warehouse_id",
      references: {
        model: "warehouses",
        key: "id"
      }
    },
    medicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "medication_id",
      references: {
        model: "medications",
        key: "id"
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active"
    }
  },
  {
    sequelize,
    modelName: "Inventory",
    tableName: "inventories",
    timestamps: true,
    indexes: [
      {
        name: "inventories_warehouse_medication_unique",
        unique: true,
        fields: ["warehouse_id", "medication_id"]
      }
    ]
  }
);

export default Inventory;
