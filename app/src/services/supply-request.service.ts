import { CreateSupplyRequestDto } from "../dto/create-supply-request.dto";
import { SupplyRequestResponseDto } from "../dto/supply-request-response.dto";
import { UpdateSupplyRequestStatusDto } from "../dto/update-supply-request-status.dto";
import AppError from "../error/appError";
import type {
  SupplyRequestAttributes,
  SupplyRequestStatus
} from "../models/supply-request.model";
import clinicRepository from "../repositories/clinic.repository";
import inventoryRepository from "../repositories/inventory.repository";
import medicationRepository from "../repositories/medication.repository";
import supplyRequestRepository from "../repositories/supply-request.repository";
import warehouseRepository from "../repositories/warehouse.repository";

const ALLOWED_TRANSITIONS: Record<SupplyRequestStatus, SupplyRequestStatus[]> = {
  PENDING: ["APPROVED", "REJECTED"],
  APPROVED: ["COMPLETED"],
  REJECTED: [],
  COMPLETED: []
};

/** Coordinates supply request rules, statuses, and available stock. */
class SupplyRequestService {
  async getAll(): Promise<SupplyRequestResponseDto[]> {
    const supplyRequests = await supplyRequestRepository.findAll();
    return supplyRequests.map((supplyRequest) => this.toResponse(supplyRequest));
  }

  async getById(id: number): Promise<SupplyRequestResponseDto> {
    return this.toResponse(await this.getSupplyRequestOrFail(id));
  }

  async getHistoryByClinic(clinicId: number): Promise<SupplyRequestResponseDto[]> {
    const clinic = await clinicRepository.findById(clinicId);
    if (!clinic) throw new AppError(404, "Clínica no encontrada");

    const supplyRequests = await supplyRequestRepository.findByClinicId(clinicId);
    return supplyRequests.map((supplyRequest) => this.toResponse(supplyRequest));
  }

  async create(
    data: CreateSupplyRequestDto,
    createdByUserId: number
  ): Promise<SupplyRequestResponseDto> {
    const [clinic, warehouse, medication, inventory] = await Promise.all([
      clinicRepository.findById(data.clinicId),
      warehouseRepository.findById(data.warehouseId),
      medicationRepository.findById(data.medicationId),
      inventoryRepository.findByWarehouseAndMedication(data.warehouseId, data.medicationId)
    ]);

    if (!clinic) throw new AppError(404, "Clínica no encontrada");
    if (!warehouse) throw new AppError(404, "Almacén no encontrado");
    if (!medication) throw new AppError(404, "Medicamento no encontrado");

    if (!inventory?.isActive || inventory.quantity < data.quantity) {
      throw new AppError(409, "El almacén no tiene inventario suficiente");
    }

    const supplyRequest = await supplyRequestRepository.create({
      ...data,
      createdByUserId,
      status: "PENDING"
    });

    return this.toResponse(supplyRequest);
  }

  async updateStatus(
    id: number,
    data: UpdateSupplyRequestStatusDto
  ): Promise<SupplyRequestResponseDto> {
    const supplyRequest = await this.getSupplyRequestOrFail(id);
    const allowedStatuses = ALLOWED_TRANSITIONS[supplyRequest.status];

    if (!allowedStatuses.includes(data.status)) {
      throw new AppError(
        400,
        `No se permite cambiar de ${supplyRequest.status} a ${data.status}`
      );
    }

    if (data.status === "APPROVED") {
      const inventory = await inventoryRepository.findByWarehouseAndMedication(
        supplyRequest.warehouseId,
        supplyRequest.medicationId
      );

      if (!inventory?.isActive || inventory.quantity < supplyRequest.quantity) {
        throw new AppError(409, "El almacén no tiene inventario suficiente");
      }

      await inventoryRepository.update(inventory, {
        quantity: inventory.quantity - supplyRequest.quantity
      });
    }

    const updatedSupplyRequest = await supplyRequestRepository.update(supplyRequest, {
      status: data.status
    });

    return this.toResponse(updatedSupplyRequest);
  }

  async delete(id: number): Promise<void> {
    await supplyRequestRepository.deactivate(await this.getSupplyRequestOrFail(id));
  }

  private async getSupplyRequestOrFail(id: number) {
    const supplyRequest = await supplyRequestRepository.findById(id);
    if (!supplyRequest) throw new AppError(404, "Solicitud no encontrada");
    return supplyRequest;
  }

  private toResponse(supplyRequest: SupplyRequestAttributes): SupplyRequestResponseDto {
    return {
      id: supplyRequest.id,
      clinicId: supplyRequest.clinicId,
      warehouseId: supplyRequest.warehouseId,
      medicationId: supplyRequest.medicationId,
      createdByUserId: supplyRequest.createdByUserId,
      quantity: supplyRequest.quantity,
      status: supplyRequest.status,
      isActive: supplyRequest.isActive
    };
  }
}

export default new SupplyRequestService();
