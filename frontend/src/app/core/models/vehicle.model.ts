export interface VehicleResponse {
  id: number;
  make: string;
  model: string;
  year: number;
  cylinders: number;
  engineType: string;
  fuelType: string;
  color?: string;
}

export interface CreateVehicleRequest {
  make: string;
  model: string;
  year: number;
  cylinders: number;
  engineType: string;
  fuelType: string;
  color?: string;
}