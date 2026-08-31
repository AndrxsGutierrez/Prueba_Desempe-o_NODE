import { z } from "zod";

/** Validates a user identifier received in the route path. */
export const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive("El id debe ser un entero positivo")
});
