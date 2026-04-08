using AutoLog.Application.DTOs.Dashboard;
using AutoLog.Application.Interfaces.Repositories;
using AutoLog.Application.Interfaces.Services;

namespace AutoLog.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IVehicleRepository _vehicleRepo;
    private readonly IFuelLogRepository _fuelRepo;
    private readonly IExchangeRateRepository _exchangeRepo; 

    public DashboardService(IVehicleRepository vehicleRepo, IFuelLogRepository fuelRepo, IExchangeRateRepository exchangeRepo)
    {
        _vehicleRepo = vehicleRepo;
        _fuelRepo = fuelRepo;
        _exchangeRepo = exchangeRepo;
    }

    public async Task<DashboardSummaryResponse> GetSummaryAsync(int userId, int? vehicleId, int? month, int? year)
    {
        var summary = new DashboardSummaryResponse();

        // Get active vehicles
        var userVehicles = await _vehicleRepo.GetVehiclesByUserIdAsync(userId);
        summary.ActiveVehiclesCount = userVehicles.Count();

        // Security: Verify that the requested vehicleId belongs to the user
        if (vehicleId.HasValue && !userVehicles.Any(v => v.Id == vehicleId))
        {
            throw new UnauthorizedAccessException("You do not have access to this vehicle.");
        }

        // Select the vehicle to analyze (the first one by default)
        int targetVehicleId = vehicleId ?? userVehicles.FirstOrDefault()?.Id ?? 0;

        var allLogs = await _fuelRepo.GetAllByVehicleIdAsync(targetVehicleId);

        // Determine the month to analyze
        if (!month.HasValue || !year.HasValue)
        {
            var lastLog = allLogs.FirstOrDefault();
            month = lastLog?.FillUpDate.Month ?? DateTime.UtcNow.Month;
            year = lastLog?.FillUpDate.Year ?? DateTime.UtcNow.Year;
        }

        // KPI: Expenditures for the selected month
        summary.TotalMonthlySpending = allLogs
            .Where(l => l.FillUpDate.Month == month && l.FillUpDate.Year == year)
            .Sum(l => l.TotalCostMxn);

        // Figure 1: Complete fuel efficiency history (km/L)
        summary.FullEfficiencyHistory = allLogs
            .Where(l => l.DistanceTraveledKm > 0)
            .OrderBy(l => l.FillUpDate) // Orden cronológico para la gráfica
            .Select(l => new FuelPointDto {
                Date = l.FillUpDate,
                KmL = Math.Round(l.DistanceTraveledKm / l.VolumeLiters, 2)
            }).ToList();

        // Figure 2: Annual Comparison (Average km/L per month)
        summary.AnnualEfficiencyComparison = allLogs
            .Where(l => l.DistanceTraveledKm > 0)
            .GroupBy(l => new { l.FillUpDate.Year, l.FillUpDate.Month })
            .Select(g => new MonthlyAverageDto {
                Year = g.Key.Year,
                Month = g.Key.Month,
                AverageKmL = Math.Round(g.Average(l => l.DistanceTraveledKm / l.VolumeLiters), 2)
            })
            .OrderBy(g => g.Year).ThenBy(g => g.Month)
            .ToList();

        // Figure 3: Total monthly spending over time
        summary.MonthlySpendingHistory = allLogs
            .GroupBy(l => new { l.FillUpDate.Year, l.FillUpDate.Month })
            .Select(g => new ChartDataPointDto {
                Label = $"{g.Key.Month:D2}/{g.Key.Year}",
                Value = g.Sum(l => l.TotalCostMxn)
            })
            .OrderBy(g => g.Label) // Simple sort
            .ToList();

        // KPI and Chart 4: Exchange Rate
        var rates = await _exchangeRepo.GetAllAsync();
        summary.LatestExchangeRate = rates.OrderByDescending(r => r.Date).FirstOrDefault()?.UsdToMxnRate;
        
        summary.ExchangeRateHistory = rates
            .OrderBy(r => r.Date)
            .TakeLast(30)
            .Select(r => new ChartDataPointDto 
            {
                Label = r.Date.ToString("dd/MM/yyyy"), // X-axis
                Value = r.UsdToMxnRate // Y-axis
            })
            .ToList();
        
        return summary;
    }
}