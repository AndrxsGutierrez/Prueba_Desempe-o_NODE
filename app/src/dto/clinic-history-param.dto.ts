import { z } from "zod";

/** Validates the clinic identifier used to retrieve its request history. */
export const clinicHistoryParamSchema = z.object({
  clinicId: z.coerce.number().int().positive("El id de clínica debe ser un entero positivo")
});
