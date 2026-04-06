using AutoLog.Application.DTOs.FuelLog;

namespace AutoLog.Application.Interfaces.Services;

public interface IFuelLogService
{
    Task<IEnumerable<FuelLogResponse>> GetAllByVehicleIdAsync(int vehicleId);
    Task<FuelLogResponse> CreateAsync(CreateFuelLogRequest request);
    Task UpdateAsync(int id, CreateFuelLogRequest request);
    Task DeleteAsync(int id);
}