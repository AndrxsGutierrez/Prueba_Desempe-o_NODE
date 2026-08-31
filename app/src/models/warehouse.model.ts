import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/** Persistent attributes for a warehouse that stores medications. */
export interface WarehouseAttributes {
  id: number;
  name: string;
  address: string;
  isActive: boolean;
}

export interface WarehouseCreationAttributes
  extends Optional<WarehouseAttributes, "id" | "isActive"> {}

class Warehouse
  extends Model<WarehouseAttributes, WarehouseCreationAttributes>
  implements WarehouseAttributes {
  public id!: number;
  public name!: string;
  public address!: string;
  public isActive!: boolean;
}

Warehouse.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    modelName: "Warehouse",
    tableName: "warehouses",
    timestamps: true
  }
);

export default Warehouse;
