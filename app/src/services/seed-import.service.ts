import { ImportSeedDataDto, importSeedDataSchema } from "../dto/import-seed-data.dto";
import AppError from "../error/appError";
import clinicRepository from "../repositories/clinic.repository";
import inventoryRepository from "../repositories/inventory.repository";
import medicationRepository from "../repositories/medication.repository";
import warehouseRepository from "../repositories/warehouse.repository";
import clinicService from "./clinic.service";
import inventoryService from "./inventory.service";
import medicationService from "./medication.service";
import warehouseService from "./warehouse.service";

interface ImportSummary {
  clinics: number;
  warehouses: number;
  medications: number;
  inventory: number;
}

/** Imports an idempotent JSON dataset using the same rules as the API. */
class SeedImportService {
  async import(file: Express.Multer.File | undefined): Promise<ImportSummary> {
    const data = this.parseFile(file);
    const summary: ImportSummary = {
      clinics: 0,
      warehouses: 0,
      medications: 0,
      inventory: 0
    };

    for (const clinic of data.clinics) {
      if (!await clinicRepository.findByNit(clinic.nit)) {
        await clinicService.create(clinic);
        summary.clinics += 1;
      }
    }

    for (const warehouse of data.warehouses) {
      if (!await warehouseRepository.findByName(warehouse.name)) {
        await warehouseService.create(warehouse);
        summary.warehouses += 1;
      }
    }

    for (const medication of data.medications) {
      if (!await medicationRepository.findByName(medication.name)) {
        await medicationService.create(medication);
        summary.medications += 1;
      }
    }

    for (const inventoryItem of data.inventory) {
      const [warehouse, medication] = await Promise.all([
        warehouseRepository.findByName(inventoryItem.warehouseName),
        medicationRepository.findByName(inventoryItem.medicationName)
      ]);

      if (!warehouse?.isActive) {
        throw new AppError(404, `Almacén no encontrado: ${inventoryItem.warehouseName}`);
      }

      if (!medication?.isActive) {
        throw new AppError(404, `Medicamento no encontrado: ${inventoryItem.medicationName}`);
      }

      const existingInventory = await inventoryRepository.findByWarehouseAndMedication(
        warehouse.id,
        medication.id
      );

      if (!existingInventory?.isActive) {
        await inventoryService.create({
          warehouseId: warehouse.id,
          medicationId: medication.id,
          quantity: inventoryItem.quantity
        });
        summary.inventory += 1;
      }
    }

    return summary;
  }

  private parseFile(file: Express.Multer.File | undefined): ImportSeedDataDto {
    if (!file) {
      throw new AppError(400, "Debes adjuntar un archivo JSON en el campo file");
    }

    if (!file.originalname.toLowerCase().endsWith(".json")) {
      throw new AppError(400, "El archivo debe tener extensión .json");
    }

    let content: unknown;

    try {
      content = JSON.parse(file.buffer.toString("utf-8"));
    } catch {
      throw new AppError(400, "El archivo no contiene un JSON válido");
    }

    const result = importSeedDataSchema.safeParse(content);

    if (!result.success) {
      throw new AppError(400, "La estructura del archivo JSON no es válida");
    }

    return result.data;
  }
}

export default new SeedImportService();
