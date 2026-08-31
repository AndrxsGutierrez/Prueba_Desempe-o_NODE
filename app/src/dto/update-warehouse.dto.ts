import { z } from "zod";
import { createWarehouseSchema } from "./create-warehouse.dto";

/** Validates the optional fields accepted when editing a warehouse. */
export const updateWarehouseSchema = createWarehouseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Debes enviar al menos un campo para actualizar" }
);

export type UpdateWarehouseDto = z.infer<typeof updateWarehouseSchema>;
