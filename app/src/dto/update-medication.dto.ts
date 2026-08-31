import { z } from "zod";
import { createMedicationSchema } from "./create-medication.dto";

/** Validates the optional fields accepted when editing a medication. */
export const updateMedicationSchema = createMedicationSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Debes enviar al menos un campo para actualizar" }
);

export type UpdateMedicationDto = z.infer<typeof updateMedicationSchema>;
