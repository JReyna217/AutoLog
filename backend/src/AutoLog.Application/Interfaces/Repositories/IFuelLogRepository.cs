using AutoLog.Domain.Entities;

namespace AutoLog.Application.Interfaces.Repositories;

public interface IFuelLogRepository
{
    Task<IEnumerable<FuelLog>> GetAllByVehicleIdAsync(int vehicleId);
    Task<FuelLog?> GetByIdAsync(int id);
    Task<FuelLog?> GetLastFillUpAsync(int vehicleId);
    Task<FuelLog> AddAsync(FuelLog fuelLog);
    Task UpdateAsync(FuelLog fuelLog);
    Task DeleteAsync(FuelLog fuelLog);
}