import Role from "./role.model";
import User from "./user.model";
import Inventory from "./inventory.model";
import Medication from "./medication.model";
import Clinic from "./clinic.model";
import SupplyRequest from "./supply-request.model";
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

Clinic.hasMany(SupplyRequest, {
  foreignKey: "clinicId",
  as: "supplyRequests"
});

SupplyRequest.belongsTo(Clinic, {
  foreignKey: "clinicId",
  as: "clinic"
});

Warehouse.hasMany(SupplyRequest, {
  foreignKey: "warehouseId",
  as: "supplyRequests"
});

SupplyRequest.belongsTo(Warehouse, {
  foreignKey: "warehouseId",
  as: "warehouse"
});

Medication.hasMany(SupplyRequest, {
  foreignKey: "medicationId",
  as: "supplyRequests"
});

SupplyRequest.belongsTo(Medication, {
  foreignKey: "medicationId",
  as: "medication"
});

User.hasMany(SupplyRequest, {
  foreignKey: "createdByUserId",
  as: "supplyRequests"
});

SupplyRequest.belongsTo(User, {
  foreignKey: "createdByUserId",
  as: "createdBy"
});
