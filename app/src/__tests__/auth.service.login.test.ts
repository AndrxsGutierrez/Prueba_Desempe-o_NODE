/// <reference types="jest" />
import AppError from "../error/appError";
import roleRepository from "../repositories/role.repository";
import userRepository from "../repositories/user.repository";
import authService from "../services/auth.service";
import { mockRole, mockUser } from "./setup";

jest.mock("../repositories/user.repository");
jest.mock("../repositories/role.repository");

describe("AuthService - login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    (roleRepository.findById as jest.Mock).mockResolvedValue(mockRole);
  });

  it("should login successfully and return token", async () => {
    const loginData = {
      email: "john@example.com",
      password: "password123",
    };

    const mockUserWithMethod = {
      ...mockUser,
      validPassword: jest.fn().mockResolvedValue(true),
    };

    (userRepository.findByEmail as jest.Mock).mockResolvedValue(
      mockUserWithMethod,
    );

    const result = await authService.login(loginData);

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("user");
    expect(result.user.email).toBe(mockUser.email);
    expect(mockUserWithMethod.validPassword).toHaveBeenCalledWith(
      loginData.password,
    );
  });

  it("should throw error if user email doesn't exist", async () => {
    const loginData = {
      email: "nonexistent@example.com",
      password: "password123",
    };

    (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(authService.login(loginData)).rejects.toThrow(
      new AppError(401, "Correo o contraseña incorrectos"),
    );
  });

  it("should throw error if password is incorrect", async () => {
    const loginData = {
      email: "john@example.com",
      password: "wrongpassword",
    };

    const mockUserWithMethod = {
      ...mockUser,
      validPassword: jest.fn().mockResolvedValue(false),
    };

    (userRepository.findByEmail as jest.Mock).mockResolvedValue(
      mockUserWithMethod,
    );

    await expect(authService.login(loginData)).rejects.toThrow(
      new AppError(401, "Correo o contraseña incorrectos"),
    );
  });

  it("should throw error if JWT_SECRET is not configured", async () => {
    const loginData = {
      email: "john@example.com",
      password: "password123",
    };

    delete process.env.JWT_SECRET;

    const mockUserWithMethod = {
      ...mockUser,
      validPassword: jest.fn().mockResolvedValue(true),
    };

    (userRepository.findByEmail as jest.Mock).mockResolvedValue(
      mockUserWithMethod,
    );

    await expect(authService.login(loginData)).rejects.toThrow(
      new AppError(500, "JWT_SECRET no está configurado"),
    );
  });
});
