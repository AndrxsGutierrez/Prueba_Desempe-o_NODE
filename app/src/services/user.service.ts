import { UserResponseDto } from "../dto/user-response.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import AppError from "../error/appError";
import type { UserCreationAttributes } from "../models/user.model";
import userRepository from "../repositories/user.repository";

class UserService {
  async getAll(): Promise<UserResponseDto[]> {
    const users = await userRepository.findAll();

    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleId: user.roleId
    }));
  }

  async getById(id: number): Promise<UserResponseDto> {
    const user = await this.getUserOrFail(id);
    return this.toResponse(user);
  }

  async update(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.getUserOrFail(id);

    if (data.email && data.email !== user.email) {
      const userWithEmail = await userRepository.findByEmail(data.email);

      if (userWithEmail) {
        throw new AppError(409, "El correo ya está registrado");
      }
    }

    const updateData: Partial<UserCreationAttributes> = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.password !== undefined) updateData.password = data.password;

    const updatedUser = await userRepository.update(user, updateData);
    return this.toResponse(updatedUser);
  }

  async delete(id: number): Promise<void> {
    const user = await this.getUserOrFail(id);
    await userRepository.delete(user);
  }

  private async getUserOrFail(id: number) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError(404, "Usuario no encontrado");
    }

    return user;
  }

  private toResponse(user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
  }): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleId: user.roleId
    };
  }
}

export default new UserService();
