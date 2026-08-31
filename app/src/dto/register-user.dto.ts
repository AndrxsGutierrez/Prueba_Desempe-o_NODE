import { z } from "zod";

/** Validates the data required to create a user account. */
export const createUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar 100 caracteres"),

  lastName: z
    .string()
    .trim()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede superar 100 caracteres"),

  email: z
    .email("El correo no es válido"),

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "La contraseña no puede superar 72 caracteres")
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
