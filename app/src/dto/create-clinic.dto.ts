import { z } from "zod";

/** Validates the data required to register a clinic. */
export const createClinicSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(150),
  nit: z.string().trim().min(5, "El NIT debe tener al menos 5 caracteres").max(30),
  address: z.string().trim().min(5, "La dirección debe tener al menos 5 caracteres").max(255),
  phone: z.string().trim().min(7, "El teléfono debe tener al menos 7 caracteres").max(30),
  responsibleName: z.string().trim().min(2, "El responsable debe tener al menos 2 caracteres").max(150),
  responsibleEmail: z.email("El correo del responsable no es válido")
});

export type CreateClinicDto = z.infer<typeof createClinicSchema>;
