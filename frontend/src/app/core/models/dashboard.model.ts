export interface DashboardSummaryResponse {
  activeVehiclesCount: number;
  latestExchangeRate: number | null;
  totalMonthlySpending: number;
  fullEfficiencyHistory: FuelPointDto[];
  annualEfficiencyComparison: MonthlyAverageDto[];
  monthlySpendingHistory: ChartDataPointDto[];
  exchangeRateHistory: ChartDataPointDto[];
}

export interface FuelPointDto {
  date: string;
  kmL: number;
}

export interface MonthlyAverageDto {
  year: number;
  month: number;
  averageKmL: number;
}

export interface ChartDataPointDto {
  label: string;
  value: number;
}