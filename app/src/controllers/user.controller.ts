import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import userService from "../services/user.service";

class UserController {
  async getUsers(_req: Request, res: Response): Promise<Response> {
    const users = await userService.getAll();
    return res.status(200).json(users);
  }

  async getUser(req: Request, res: Response): Promise<Response> {
    const user = await userService.getById(Number(req.params.id));
    return res.status(200).json({ user });
  }

  async getProfile(req: AuthRequest, res: Response): Promise<Response> {
    const user = await userService.getById(Number(req.user?.userId));
    return res.status(200).json({ user });
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    const user = await userService.update(Number(req.params.id), req.body);
    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      user
    });
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    await userService.delete(Number(req.params.id));
    return res.status(204).send();
  }
}

export default new UserController();
