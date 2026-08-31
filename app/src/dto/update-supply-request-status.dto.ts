import { z } from "zod";

/** Validates an allowed status for an existing supply request. */
export const updateSupplyRequestStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "COMPLETED"])
});

export type UpdateSupplyRequestStatusDto = z.infer<typeof updateSupplyRequestStatusSchema>;
