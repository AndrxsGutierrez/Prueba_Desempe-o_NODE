import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100).optional(),
  lastName: z.string().trim().min(2, "El apellido debe tener al menos 2 caracteres").max(100).optional(),
  email: z.email("El correo no es válido").optional(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(72).optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "Debes enviar al menos un campo para actualizar"
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
