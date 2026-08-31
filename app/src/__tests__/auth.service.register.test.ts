/// <reference types="jest" />

/** Covers the authentication service registration flow. */
import AppError from "../error/appError";
import roleRepository from "../repositories/role.repository";
import userRepository from "../repositories/user.repository";
import authService from "../services/auth.service";
import { mockRole, mockUser } from "./setup";

jest.mock("../repositories/user.repository");
jest.mock("../repositories/role.repository");

describe("AuthService - register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a user successfully", async () => {
    const newUser = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
    };

    (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (roleRepository.findByName as jest.Mock).mockResolvedValue(mockRole);
    (userRepository.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await authService.register(newUser);

    expect(result).toEqual({
      id: mockUser.id,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      role: mockRole.name,
    });
    expect(userRepository.findByEmail).toHaveBeenCalledWith(newUser.email);
    expect(roleRepository.findByName).toHaveBeenCalledWith("USER");
    expect(userRepository.create).toHaveBeenCalled();
  });

  it("should throw error if email already exists", async () => {
    const newUser = {
      firstName: "John",
      lastName: "Doe",
      email: "existing@example.com",
      password: "password123",
    };

    (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

    await expect(authService.register(newUser)).rejects.toThrow(
      new AppError(409, "El correo ya está registrado"),
    );
  });

  it("should throw error if USER role doesn't exist", async () => {
    const newUser = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
    };

    (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (roleRepository.findByName as jest.Mock).mockResolvedValue(null);

    await expect(authService.register(newUser)).rejects.toThrow(
      new AppError(500, "El rol USER no está configurado"),
    );
  });
});
