import Role from "./role.model";
import User from "./user.model";

// asociacion entre user y roles
Role.hasMany(User, {
  foreignKey: "roleId",
  as: "users"
});

User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role"
});