import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../error/appError";

/** Extends Express requests with the verified JWT payload. */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/** Requires a valid Bearer token before continuing to a protected route. */
export function authenticateToken(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
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
