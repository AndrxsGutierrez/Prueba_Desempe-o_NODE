import User, { UserCreationAttributes } from "../models/user.model";

/** Contains only the database operations needed for users. */
class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({
      where: { email }
    });
  }

  async findActiveByEmail(email: string): Promise<User | null> {
    return User.findOne({
      where: {
        email,
        isActive: true
      }
    });
  }

  async findById(id: number): Promise<User | null> {
    return User.findOne({
      where: {
        id,
        isActive: true
      }
    });
  }

  async findAll(): Promise<User[]> {
    return User.findAll({
      where: { isActive: true }
    });
  }

  async create(data: UserCreationAttributes): Promise<User> {
    return User.create(data);
  }

  async update(user: User, data: Partial<UserCreationAttributes>): Promise<User> {
    return user.update(data);
  }

  async deactivate(user: User): Promise<User> {
    return user.update({ isActive: false });
  }

}

export default new UserRepository();
