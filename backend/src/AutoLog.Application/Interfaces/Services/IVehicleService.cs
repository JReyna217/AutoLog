using AutoLog.Application.DTOs.Vehicles;

namespace AutoLog.Application.Interfaces.Services;

/// <summary>
/// Defines the business logic operations for vehicles.
/// </summary>
public interface IVehicleService
{
    Task<IEnumerable<VehicleResponseDto>> GetAllVehiclesAsync(int userId);
    Task<VehicleResponseDto> GetVehicleByIdAsync(int id, int userId);
    Task<VehicleResponseDto> CreateVehicleAsync(int userId, CreateVehicleDto dto);
    Task UpdateVehicleAsync(int id, int userId, UpdateVehicleDto dto);
    Task DeleteVehicleAsync(int id, int userId);
}