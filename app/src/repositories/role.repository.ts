import Role from "../models/role.model";

class RoleRepository {

  async findByName(name: string): Promise<Role | null> {
    return await Role.findOne({
      where: { name }
    });
  }

  async findById(id: number): Promise<Role | null> {
    return Role.findByPk(id);
  }
}

export default new RoleRepository();
