import { SupplyRequestStatus } from "../models/supply-request.model";

/** Public supply request shape returned by the API. */
export interface SupplyRequestResponseDto {
  id: number;
  clinicId: number;
  warehouseId: number;
  medicationId: number;
  createdByUserId: number;
  quantity: number;
  status: SupplyRequestStatus;
  isActive: boolean;
}
