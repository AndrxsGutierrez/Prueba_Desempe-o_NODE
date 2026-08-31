import { z } from "zod";

/** Validates the data required to register a medication. */
export const createMedicationSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(150),
  description: z.string().trim().min(5, "La descripción debe tener al menos 5 caracteres").max(500)
});

export type CreateMedicationDto = z.infer<typeof createMedicationSchema>;
