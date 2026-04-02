import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ExchangeRateResponse, CreateExchangeRateRequest } from '../models/exchange-rate.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/exchangerates`;

  getRates(): Observable<ExchangeRateResponse[]> {
    return this.http.get<ExchangeRateResponse[]>(this.apiUrl);
  }

  createRate(rate: CreateExchangeRateRequest): Observable<ExchangeRateResponse> {
    return this.http.post<ExchangeRateResponse>(this.apiUrl, rate);
  }

  updateRate(id: number, rate: CreateExchangeRateRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, rate);
  }

  deleteRate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}