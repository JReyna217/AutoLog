import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DashboardSummaryResponse } from '../models/dashboard.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  getSummary(vehicleId?: number | null, month?: number, year?: number): Observable<DashboardSummaryResponse> {
    let params = new HttpParams();
    if (vehicleId) params = params.set('vehicleId', vehicleId.toString());
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());

    return this.http.get<DashboardSummaryResponse>(`${this.apiUrl}/summary`, { params });
  }
}