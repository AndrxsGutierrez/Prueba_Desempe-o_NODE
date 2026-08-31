import { z } from "zod";
import { createClinicSchema } from "./create-clinic.dto";

/** Validates the optional fields accepted when editing a clinic. */
export const updateClinicSchema = createClinicSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Debes enviar al menos un campo para actualizar" }
);

export type UpdateClinicDto = z.infer<typeof updateClinicSchema>;
