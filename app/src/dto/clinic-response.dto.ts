/** Public clinic shape returned by the API. */
export interface ClinicResponseDto {
  id: number;
  name: string;
  nit: string;
  address: string;
  phone: string;
  responsibleName: string;
  responsibleEmail: string;
  isActive: boolean;
}
