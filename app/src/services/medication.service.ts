import { CreateMedicationDto } from "../dto/create-medication.dto";
import { MedicationResponseDto } from "../dto/medication-response.dto";
import { UpdateMedicationDto } from "../dto/update-medication.dto";
import AppError from "../error/appError";
import type { MedicationCreationAttributes } from "../models/medication.model";
import medicationRepository from "../repositories/medication.repository";

/** Applies medication catalog rules before changing persistent data. */
class MedicationService {
  async getAll(): Promise<MedicationResponseDto[]> {
    const medications = await medicationRepository.findAll();
    return medications.map((medication) => this.toResponse(medication));
  }

  async getById(id: number): Promise<MedicationResponseDto> {
    return this.toResponse(await this.getMedicationOrFail(id));
  }

  async create(data: CreateMedicationDto): Promise<MedicationResponseDto> {
    const medicationWithName = await medicationRepository.findByName(data.name);
    if (medicationWithName) throw new AppError(409, "Ya existe un medicamento con este nombre");

    return this.toResponse(await medicationRepository.create(data));
  }

  async update(id: number, data: UpdateMedicationDto): Promise<MedicationResponseDto> {
    const medication = await this.getMedicationOrFail(id);

    if (data.name && data.name !== medication.name) {
      const medicationWithName = await medicationRepository.findByName(data.name);
      if (medicationWithName) throw new AppError(409, "Ya existe un medicamento con este nombre");
    }

    const updateData: Partial<MedicationCreationAttributes> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;

    return this.toResponse(await medicationRepository.update(medication, updateData));
  }

  async delete(id: number): Promise<void> {
    await medicationRepository.deactivate(await this.getMedicationOrFail(id));
  }

  private async getMedicationOrFail(id: number) {
    const medication = await medicationRepository.findById(id);
    if (!medication) throw new AppError(404, "Medicamento no encontrado");
    return medication;
  }

  private toResponse(medication: MedicationResponseDto): MedicationResponseDto {
    return {
      id: medication.id,
      name: medication.name,
      description: medication.description,
      isActive: medication.isActive
    };
  }
}

export default new MedicationService();
