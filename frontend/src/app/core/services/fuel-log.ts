import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FuelLogResponse, CreateFuelLogRequest } from '../models/fuel-log.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuelLogService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/fuellogs`;

  getByVehicle(vehicleId: number): Observable<FuelLogResponse[]> {
    return this.http.get<FuelLogResponse[]>(`${this.apiUrl}/vehicle/${vehicleId}`);
  }

  create(log: CreateFuelLogRequest): Observable<FuelLogResponse> {
    return this.http.post<FuelLogResponse>(this.apiUrl, log);
  }

  update(id: number, log: CreateFuelLogRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, log);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}