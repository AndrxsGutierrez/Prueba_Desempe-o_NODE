import { z } from "zod";

/** Validates a clinic identifier received in the route path. */
export const clinicIdParamSchema = z.object({
  id: z.coerce.number().int().positive("El id debe ser un entero positivo")
});
