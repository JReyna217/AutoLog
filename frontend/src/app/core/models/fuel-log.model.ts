export interface FuelLogResponse {
  id: number;
  vehicleId: number;
  fillUpDate: string;
  distanceTraveledKm: number;
  volumeLiters: number;
  totalCostMxn: number;
  isFullTank: boolean;
  odometerKm: number;
}

export interface CreateFuelLogRequest {
  vehicleId: number;
  fillUpDate: string;
  isOdometerInMiles: boolean;
  currentOdometer: number;
  isVolumeInGallons: boolean;
  inputVolume: number;
  isPaidInUsd: boolean;
  inputCost: number;
  appliedExchangeRate?: number | null;
  isFullTank: boolean;
  notes?: string;
}