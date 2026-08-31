import { ClinicResponseDto } from "../dto/clinic-response.dto";
import { CreateClinicDto } from "../dto/create-clinic.dto";
import { UpdateClinicDto } from "../dto/update-clinic.dto";
import AppError from "../error/appError";
import type { ClinicCreationAttributes } from "../models/clinic.model";
import clinicRepository from "../repositories/clinic.repository";

class ClinicService {
  async getAll(): Promise<ClinicResponseDto[]> {
    const clinics = await clinicRepository.findAll();
    return clinics.map((clinic) => this.toResponse(clinic));
  }

  async getById(id: number): Promise<ClinicResponseDto> {
    const clinic = await this.getClinicOrFail(id);
    return this.toResponse(clinic);
  }

  async create(data: CreateClinicDto): Promise<ClinicResponseDto> {
    const clinicWithNit = await clinicRepository.findByNit(data.nit);

    if (clinicWithNit) {
      throw new AppError(409, "Ya existe una clínica registrada con este NIT");
    }

    const clinic = await clinicRepository.create(data);
    return this.toResponse(clinic);
  }

  async update(id: number, data: UpdateClinicDto): Promise<ClinicResponseDto> {
    const clinic = await this.getClinicOrFail(id);

    if (data.nit && data.nit !== clinic.nit) {
      const clinicWithNit = await clinicRepository.findByNit(data.nit);

      if (clinicWithNit) {
        throw new AppError(409, "Ya existe una clínica registrada con este NIT");
      }
    }

    const updateData: Partial<ClinicCreationAttributes> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.nit !== undefined) updateData.nit = data.nit;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.responsibleName !== undefined) updateData.responsibleName = data.responsibleName;
    if (data.responsibleEmail !== undefined) updateData.responsibleEmail = data.responsibleEmail;

    const updatedClinic = await clinicRepository.update(clinic, updateData);
    return this.toResponse(updatedClinic);
  }

  async delete(id: number): Promise<void> {
    const clinic = await this.getClinicOrFail(id);
    await clinicRepository.deactivate(clinic);
  }

  private async getClinicOrFail(id: number) {
    const clinic = await clinicRepository.findById(id);

    if (!clinic) {
      throw new AppError(404, "Clínica no encontrada");
    }

    return clinic;
  }

  private toResponse(clinic: {
    id: number;
    name: string;
    nit: string;
    address: string;
    phone: string;
    responsibleName: string;
    responsibleEmail: string;
    isActive: boolean;
  }): ClinicResponseDto {
    return {
      id: clinic.id,
      name: clinic.name,
      nit: clinic.nit,
      address: clinic.address,
      phone: clinic.phone,
      responsibleName: clinic.responsibleName,
      responsibleEmail: clinic.responsibleEmail,
      isActive: clinic.isActive
    };
  }
}

export default new ClinicService();
