using AutoLog.Application.DTOs.Dashboard;

namespace AutoLog.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<DashboardSummaryResponse> GetSummaryAsync(int userId, int? vehicleId, int? month, int? year);
}