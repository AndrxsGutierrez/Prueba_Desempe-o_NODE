import Role from "./role.model";
import User from "./user.model";
import Inventory from "./inventory.model";
import Medication from "./medication.model";
import Warehouse from "./warehouse.model";

/** Defines the relationships shared by the application's Sequelize models. */
Role.hasMany(User, {
  foreignKey: "roleId",
  as: "users"
});

User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role"
});

Warehouse.hasMany(Inventory, {
  foreignKey: "warehouseId",
  as: "inventories"
});

Inventory.belongsTo(Warehouse, {
  foreignKey: "warehouseId",
  as: "warehouse"
});

Medication.hasMany(Inventory, {
  foreignKey: "medicationId",
  as: "inventories"
});

Inventory.belongsTo(Medication, {
  foreignKey: "medicationId",
  as: "medication"
});
