import { z } from "zod";

/** Validates a stock quantity update. */
export const updateInventorySchema = z.object({
  quantity: z.number().int().min(0, "La cantidad no puede ser negativa")
});

export type UpdateInventoryDto = z.infer<typeof updateInventorySchema>;
