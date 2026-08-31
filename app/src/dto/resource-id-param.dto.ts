import { z } from "zod";

/** Reusable validation for numeric resource identifiers. */
export const resourceIdParamSchema = z.object({
  id: z.coerce.number().int().positive("El id debe ser un entero positivo")
});
