import { z } from "zod";
import { createClinicSchema } from "./create-clinic.dto";
import { createMedicationSchema } from "./create-medication.dto";
import { createWarehouseSchema } from "./create-warehouse.dto";

const inventoryImportSchema = z.object({
  warehouseName: z.string().trim().min(2),
  medicationName: z.string().trim().min(2),
  quantity: z.number().int().min(0, "La cantidad no puede ser negativa")
});

/** Validates the JSON structure accepted by the seed import endpoint. */
export const importSeedDataSchema = z.object({
  clinics: z.array(createClinicSchema).default([]),
  warehouses: z.array(createWarehouseSchema).default([]),
  medications: z.array(createMedicationSchema).default([]),
  inventory: z.array(inventoryImportSchema).default([])
});

export type ImportSeedDataDto = z.infer<typeof importSeedDataSchema>;
