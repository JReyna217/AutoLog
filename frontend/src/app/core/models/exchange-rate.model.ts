export interface ExchangeRateResponse {
  id: number;
  date: string; // Comes as "YYYY-MM-DD" from C# DateOnly
  usdToMxnRate: number;
}

export interface CreateExchangeRateRequest {
  date: string; // We will send "YYYY-MM-DD"
  usdToMxnRate: number;
}