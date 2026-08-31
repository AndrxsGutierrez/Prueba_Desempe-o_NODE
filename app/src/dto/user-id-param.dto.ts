import { z } from "zod";

export const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive("El id debe ser un entero positivo")
});
