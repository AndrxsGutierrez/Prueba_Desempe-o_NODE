import SupplyRequest, {
  SupplyRequestCreationAttributes
} from "../models/supply-request.model";

/** Contains only the database operations needed for supply requests. */
class SupplyRequestRepository {
  async findById(id: number): Promise<SupplyRequest | null> {
    return SupplyRequest.findOne({
      where: {
        id,
        isActive: true
      }
    });
  }

  async findAll(): Promise<SupplyRequest[]> {
    return SupplyRequest.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]]
    });
  }

  async findByClinicId(clinicId: number): Promise<SupplyRequest[]> {
    return SupplyRequest.findAll({
      where: {
        clinicId,
        isActive: true
      },
      order: [["createdAt", "DESC"]]
    });
  }

  async create(data: SupplyRequestCreationAttributes): Promise<SupplyRequest> {
    return SupplyRequest.create(data);
  }

  async update(
    supplyRequest: SupplyRequest,
    data: Partial<SupplyRequestCreationAttributes>
  ): Promise<SupplyRequest> {
    return supplyRequest.update(data);
  }

  async deactivate(supplyRequest: SupplyRequest): Promise<SupplyRequest> {
    return supplyRequest.update({ isActive: false });
  }
}

export default new SupplyRequestRepository();
