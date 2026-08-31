import { z } from "zod";

/** Validates a medication quantity assigned to a warehouse. */
export const createInventorySchema = z.object({
  warehouseId: z.number().int().positive("El almacén debe ser válido"),
  medicationId: z.number().int().positive("El medicamento debe ser válido"),
  quantity: z.number().int().min(0, "La cantidad no puede ser negativa")
});

export type CreateInventoryDto = z.infer<typeof createInventorySchema>;
