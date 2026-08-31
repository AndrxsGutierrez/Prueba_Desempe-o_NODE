import Clinic, { ClinicCreationAttributes } from "../models/clinic.model";

/** Contains only the database operations needed for clinics. */
class ClinicRepository {
  async findById(id: number): Promise<Clinic | null> {
    return Clinic.findOne({
      where: {
        id,
        isActive: true
      }
    });
  }

  async findByNit(nit: string): Promise<Clinic | null> {
    return Clinic.findOne({
      where: { nit }
    });
  }

  async findAll(): Promise<Clinic[]> {
    return Clinic.findAll({
      where: { isActive: true }
    });
  }

  async create(data: ClinicCreationAttributes): Promise<Clinic> {
    return Clinic.create(data);
  }

  async update(
    clinic: Clinic,
    data: Partial<ClinicCreationAttributes>
  ): Promise<Clinic> {
    return clinic.update(data);
  }

  async deactivate(clinic: Clinic): Promise<Clinic> {
    return clinic.update({ isActive: false });
  }
}

export default new ClinicRepository();
