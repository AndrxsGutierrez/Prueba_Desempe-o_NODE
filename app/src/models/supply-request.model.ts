import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export type SupplyRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

/** Persistent data for a clinic medication supply request. */
export interface SupplyRequestAttributes {
  id: number;
  clinicId: number;
  warehouseId: number;
  medicationId: number;
  createdByUserId: number;
  quantity: number;
  status: SupplyRequestStatus;
  isActive: boolean;
}

export interface SupplyRequestCreationAttributes
  extends Optional<SupplyRequestAttributes, "id" | "status" | "isActive"> {}

class SupplyRequest
  extends Model<SupplyRequestAttributes, SupplyRequestCreationAttributes>
  implements SupplyRequestAttributes {
  public id!: number;
  public clinicId!: number;
  public warehouseId!: number;
  public medicationId!: number;
  public createdByUserId!: number;
  public quantity!: number;
  public status!: SupplyRequestStatus;
  public isActive!: boolean;
}

SupplyRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    clinicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "clinic_id",
      references: {
        model: "clinics",
        key: "id"
      }
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
    createdByUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_by_user_id",
      references: {
        model: "users",
        key: "id"
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "COMPLETED"),
      allowNull: false,
      defaultValue: "PENDING"
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
    modelName: "SupplyRequest",
    tableName: "supply_requests",
    timestamps: true
  }
);

export default SupplyRequest;
