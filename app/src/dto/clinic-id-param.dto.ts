import { z } from "zod";

export const clinicIdParamSchema = z.object({
  id: z.coerce.number().int().positive("El id debe ser un entero positivo")
});
