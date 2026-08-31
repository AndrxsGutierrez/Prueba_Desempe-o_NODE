import User, { UserCreationAttributes } from "../models/user.model";

/** Contains only the database operations needed for users. */
class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({
      where: { email }
    });
  }

  async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  async findAll(): Promise<User[]> {
    return User.findAll()
  }

  async create(data: UserCreationAttributes): Promise<User> {
    return User.create(data);
  }

  async update(user: User, data: Partial<UserCreationAttributes>): Promise<User> {
    return user.update(data);
  }

  async delete(user: User): Promise<void> {
    await user.destroy();
  }

}

export default new UserRepository();
