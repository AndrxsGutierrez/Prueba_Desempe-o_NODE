import { NextFunction, Response } from "express";
import AppError from "../error/appError";
import { AuthRequest } from "./auth.middleware";

/** Allows access only when the JWT role belongs to the permitted roles. */
export function authorizeRoles(...allowedRoles: string[]) {
  return (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
  ): void => {
    const role = req.user?.role;

    if (typeof role !== "string" || !allowedRoles.includes(role)) {
      next(new AppError(403, "No tienes permiso para realizar esta acción"));
      return;
    }

    next();
  };
}
