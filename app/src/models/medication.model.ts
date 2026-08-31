import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/** Persistent attributes that describe a medication catalog entry. */
export interface MedicationAttributes {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface MedicationCreationAttributes
  extends Optional<MedicationAttributes, "id" | "isActive"> {}

class Medication
  extends Model<MedicationAttributes, MedicationCreationAttributes>
  implements MedicationAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public isActive!: boolean;
}

Medication.init(
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
    description: {
      type: DataTypes.STRING(500),
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
    modelName: "Medication",
    tableName: "medications",
    timestamps: true
  }
);

export default Medication;
