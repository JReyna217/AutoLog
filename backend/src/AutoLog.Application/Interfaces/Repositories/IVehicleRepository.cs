using AutoLog.Domain.Entities;

namespace AutoLog.Application.Interfaces.Repositories;

/// <summary>
/// Repository interface for Vehicle specific database operations.
/// </summary>
public interface IVehicleRepository
{
    Task<IEnumerable<Vehicle>> GetVehiclesByUserIdAsync(int userId);
    Task<Vehicle?> GetVehicleByIdAsync(int id, int userId);
    Task<Vehicle> AddAsync(Vehicle vehicle);
    Task UpdateAsync(Vehicle vehicle);
    Task DeleteAsync(Vehicle vehicle);
}