import { NextFunction, Request, Response } from "express";
import multer from "multer";
import AppError from "../error/appError";

/** Sends a consistent JSON response for expected and unexpected errors. */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  if (error instanceof AppError) {
    return res.status(error.status).json({ message: error.message });
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: "No fue posible procesar el archivo adjunto" });
  }

  console.error(error);
  return res.status(500).json({ message: "Error interno del servidor" });
}
