import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { VehicleResponse, CreateVehicleRequest } from '../models/vehicle.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/vehicles`;

  // Fetches all vehicles for the authenticated user
  getVehicles(): Observable<VehicleResponse[]> {
    return this.http.get<VehicleResponse[]>(this.apiUrl);
  }

  // Sends a POST request to create a new vehicle
  createVehicle(vehicle: CreateVehicleRequest): Observable<VehicleResponse> {
    return this.http.post<VehicleResponse>(this.apiUrl, vehicle);
  }

  // Sends a PUT request to update an existing vehicle
  updateVehicle(id: number, vehicle: CreateVehicleRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, vehicle);
  }

  // Sends a DELETE request to remove a vehicle
  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}