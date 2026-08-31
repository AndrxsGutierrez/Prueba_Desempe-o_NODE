import { z } from "zod";

/** Validates the data required to create a supply request. */
export const createSupplyRequestSchema = z.object({
  clinicId: z.number().int().positive("La clínica debe ser válida"),
  warehouseId: z.number().int().positive("El almacén debe ser válido"),
  medicationId: z.number().int().positive("El medicamento debe ser válido"),
  quantity: z.number().int().positive("La cantidad debe ser mayor que cero")
});

export type CreateSupplyRequestDto = z.infer<typeof createSupplyRequestSchema>;
