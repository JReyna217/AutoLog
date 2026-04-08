using System;

namespace AutoLog.Application.DTOs.Dashboard;

public class DashboardSummaryResponse
{
    public int ActiveVehiclesCount { get; set; }
    public decimal? LatestExchangeRate { get; set; }
    public decimal TotalMonthlySpending { get; set; }

    public List<FuelPointDto> FullEfficiencyHistory { get; set; } = new();
    public List<MonthlyAverageDto> AnnualEfficiencyComparison { get; set; } = new();
    public List<ChartDataPointDto> MonthlySpendingHistory { get; set; } = new();
    public List<ChartDataPointDto> ExchangeRateHistory { get; set; } = new();
}
