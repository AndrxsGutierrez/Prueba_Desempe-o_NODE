import { Request, Response } from "express";
import authService from "../services/auth.service";

/** Handles registration and login HTTP responses. */
class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const user = await authService.register(req.body);

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user
    });
  }

  async login(req: Request, res: Response): Promise<Response> {
    const result = await authService.login(req.body);

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      ...result
    });
  }

}

export default new AuthController();
