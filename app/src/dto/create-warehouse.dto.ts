import { z } from "zod";

/** Validates the data required to register a warehouse. */
export const createWarehouseSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(150),
  address: z.string().trim().min(5, "La dirección debe tener al menos 5 caracteres").max(255)
});

export type CreateWarehouseDto = z.infer<typeof createWarehouseSchema>;
