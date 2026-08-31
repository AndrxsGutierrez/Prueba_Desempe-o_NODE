import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/** Persistent attributes that describe a clinic and its contact person. */
export interface ClinicAttributes {
  id: number;
  name: string;
  nit: string;
  address: string;
  phone: string;
  responsibleName: string;
  responsibleEmail: string;
  isActive: boolean;
}

export interface ClinicCreationAttributes
  extends Optional<ClinicAttributes, "id" | "isActive"> {}

class Clinic
  extends Model<ClinicAttributes, ClinicCreationAttributes>
  implements ClinicAttributes {
  public id!: number;
  public name!: string;
  public nit!: string;
  public address!: string;
  public phone!: string;
  public responsibleName!: string;
  public responsibleEmail!: string;
  public isActive!: boolean;
}

Clinic.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    nit: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    responsibleName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "responsible_name"
    },
    responsibleEmail: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "responsible_email"
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
    modelName: "Clinic",
    tableName: "clinics",
    timestamps: true
  }
);

export default Clinic;
