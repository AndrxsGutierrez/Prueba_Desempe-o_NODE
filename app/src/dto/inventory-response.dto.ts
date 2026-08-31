/** Public inventory record returned by the API. */
export interface InventoryResponseDto {
  id: number;
  warehouseId: number;
  medicationId: number;
  quantity: number;
  isActive: boolean;
}
