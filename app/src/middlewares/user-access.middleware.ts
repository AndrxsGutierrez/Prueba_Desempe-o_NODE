import { NextFunction, Response } from "express";
import AppError from "../error/appError";
import roleRepository from "../repositories/role.repository";
import userRepository from "../repositories/user.repository";
import { AuthRequest } from "./auth.middleware";

/** Role allowed to manage accounts other than its own. */
const ADMIN_ROLE = "ADMIN";

function getAuthenticatedUserId(req: AuthRequest): number {
  const userId = req.user?.userId;

  if (typeof userId !== "number") {
    throw new AppError(401, "Token inválido");
  }

  return userId;
}

function isAdmin(req: AuthRequest): boolean {
  return req.user?.role === ADMIN_ROLE;
}

/** Protects account updates and deletions according to ownership and role. */
export async function authorizeUserMutation(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authenticatedUserId = getAuthenticatedUserId(req);
    const targetUserId = Number(req.params.id);

    if (!isAdmin(req)) {
      if (authenticatedUserId === targetUserId) {
        next();
        return;
      }

      throw new AppError(403, "No tienes permiso para modificar este usuario");
    }

    if (authenticatedUserId === targetUserId) {
      throw new AppError(403, "Un administrador no puede modificarse desde esta ruta");
    }

    const [targetUser, adminRole] = await Promise.all([
      userRepository.findById(targetUserId),
      roleRepository.findByName(ADMIN_ROLE)
    ]);

    if (!targetUser) {
      throw new AppError(404, "Usuario no encontrado");
    }

    if (!adminRole) {
      throw new AppError(500, "El rol ADMIN no está configurado");
    }

    if (targetUser.roleId === adminRole.id) {
      throw new AppError(403, "No puedes modificar otra cuenta administradora");
    }

    next();
  } catch (error) {
    next(error);
  }
}
