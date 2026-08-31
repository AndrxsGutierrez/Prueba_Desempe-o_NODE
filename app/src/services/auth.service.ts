import { CreateUserDto } from "../dto/register-user.dto";
import AppError from "../error/appError";
import roleRepository from "../repositories/role.repository";
import userRepository from "../repositories/user.repository";
import jwt from "jsonwebtoken";
import { LoginUserDto } from "../dto/login-user.dto";

/** Holds the authentication rules independently from HTTP concerns. */
class AuthService {

  async register(data: CreateUserDto) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError(409, "El correo ya está registrado");
    }

    const userRole = await roleRepository.findByName("USER");

    if (!userRole) {
      throw new AppError(500, "El rol USER no está configurado");
    }

    const user = await userRepository.create({
      ...data,
      roleId: userRole.id
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: userRole.name
    };
  }

  async login(data: LoginUserDto) {
    
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError(401, "Correo o contraseña incorrectos");
    }

    const isPasswordValid = await user.validPassword(data.password);

    if (!isPasswordValid) {
      throw new AppError(401, "Correo o contraseña incorrectos");
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new AppError(500, "JWT_SECRET no está configurado");
    }

    const role = await roleRepository.findById(user.roleId);

    if (!role) {
      throw new AppError(500, "El rol del usuario no está configurado");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        roleId: user.roleId,
        role: role.name
      },
      jwtSecret,
      {
        expiresIn: "1h"
      }
    );

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }
    };
  }

}

export default new AuthService();
