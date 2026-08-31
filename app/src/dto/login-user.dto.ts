import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.email("El correo no es válido"),
  password: z.string().min(1, "La contraseña es obligatoria")
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;