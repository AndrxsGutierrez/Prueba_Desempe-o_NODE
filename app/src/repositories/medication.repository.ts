import Medication, { MedicationCreationAttributes } from "../models/medication.model";

/** Contains only the database operations needed for medications. */
class MedicationRepository {
  async findById(id: number): Promise<Medication | null> {
    return Medication.findOne({
      where: {
        id,
        isActive: true
      }
    });
  }

  async findByName(name: string): Promise<Medication | null> {
    return Medication.findOne({
      where: { name }
    });
  }

  async findAll(): Promise<Medication[]> {
    return Medication.findAll({
      where: { isActive: true }
    });
  }

  async create(data: MedicationCreationAttributes): Promise<Medication> {
    return Medication.create(data);
  }

  async update(
    medication: Medication,
    data: Partial<MedicationCreationAttributes>
  ): Promise<Medication> {
    return medication.update(data);
  }

  async deactivate(medication: Medication): Promise<Medication> {
    return medication.update({ isActive: false });
  }
}

export default new MedicationRepository();
