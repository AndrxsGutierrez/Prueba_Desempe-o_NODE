import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../error/appError";
import userRepository from "../repositories/user.repository";

/** Extends Express requests with the verified JWT payload. */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/** Requires a valid Bearer token before continuing to a protected route. */
export async function authenticateToken(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError(401, "Token de autenticación requerido");
    }

    const token = authorization.slice("Bearer ".length);

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new AppError(500, "JWT_SECRET no está configurado");
    }

    const payload = jwt.verify(token, jwtSecret);

    if (typeof payload === "string") {
      throw new AppError(401, "Token inválido");
    }

    if (typeof payload.userId !== "number") {
      throw new AppError(401, "Token inválido");
    }

    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw new AppError(401, "Usuario no disponible");
    }

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError(401, "Token inválido o vencido"));
  }
}
