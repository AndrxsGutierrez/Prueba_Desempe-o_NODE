import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface RoleAttributes {
  id: number;
  name: string;
}


export interface RoleCreationAttributes
  extends Optional<RoleAttributes, "id"> {}


class Role
extends Model<RoleAttributes, RoleCreationAttributes>
implements RoleAttributes {
  public id!: number;
  public name!: string
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "roles",
    timestamps: true
  }
)

export default Role;





