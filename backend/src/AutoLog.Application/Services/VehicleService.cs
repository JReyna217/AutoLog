using AutoLog.Application.DTOs.Vehicles;
using AutoLog.Application.Interfaces.Repositories;
using AutoLog.Application.Interfaces.Services;
using AutoLog.Domain.Entities;

namespace AutoLog.Application.Services;

/// <summary>
/// Implements the business logic for vehicle management.
/// </summary>
public class VehicleService : IVehicleService
{
    private readonly IVehicleRepository _vehicleRepository;

    public VehicleService(IVehicleRepository vehicleRepository)
    {
        _vehicleRepository = vehicleRepository;
    }

    public async Task<IEnumerable<VehicleResponseDto>> GetAllVehiclesAsync(int userId)
    {
        var vehicles = await _vehicleRepository.GetVehiclesByUserIdAsync(userId);

        // Map Entities to DTOs
        return vehicles.Select(v => new VehicleResponseDto
        {
            Id = v.Id,
            Make = v.Make,
            Model = v.Model,
            Year = v.Year,
            Cylinders = v.Cylinders,
            EngineType = v.EngineType,
            FuelType = v.FuelType,
            Color = v.Color
        });
    }

    public async Task<VehicleResponseDto> GetVehicleByIdAsync(int id, int userId)
    {
        var vehicle = await _vehicleRepository.GetVehicleByIdAsync(id, userId);

        if (vehicle == null)
        {
            throw new KeyNotFoundException($"Vehicle with ID {id} not found or access denied.");
        }

        return new VehicleResponseDto
        {
            Id = vehicle.Id,
            Make = vehicle.Make,
            Model = vehicle.Model,
            Year = vehicle.Year,
            Cylinders = vehicle.Cylinders,
            EngineType = vehicle.EngineType,
            FuelType = vehicle.FuelType,
            Color = vehicle.Color
        };
    }

    public async Task<VehicleResponseDto> CreateVehicleAsync(int userId, CreateVehicleDto dto)
    {
        // Map DTO to Entity
        var vehicle = new Vehicle
        {
            UserId = userId,
            Make = dto.Make,
            Model = dto.Model,
            Year = dto.Year,
            Cylinders = dto.Cylinders,
            EngineType = dto.EngineType,
            FuelType = dto.FuelType,
            Color = dto.Color
        };

        var createdVehicle = await _vehicleRepository.AddAsync(vehicle);

        // Map back to Response DTO
        return new VehicleResponseDto
        {
            Id = createdVehicle.Id,
            Make = createdVehicle.Make,
            Model = createdVehicle.Model,
            Year = createdVehicle.Year,
            Cylinders = createdVehicle.Cylinders,
            EngineType = createdVehicle.EngineType,
            FuelType = createdVehicle.FuelType,
            Color = createdVehicle.Color
        };
    }

    public async Task UpdateVehicleAsync(int id, int userId, UpdateVehicleDto dto)
    {
        var vehicle = await _vehicleRepository.GetVehicleByIdAsync(id, userId);

        if (vehicle == null)
        {
            throw new KeyNotFoundException($"Vehicle with ID {id} not found or access denied.");
        }

        // Update entity properties
        vehicle.Make = dto.Make;
        vehicle.Model = dto.Model;
        vehicle.Year = dto.Year;
        vehicle.Cylinders = dto.Cylinders;
        vehicle.EngineType = dto.EngineType;
        vehicle.FuelType = dto.FuelType;
        vehicle.Color = dto.Color;

        await _vehicleRepository.UpdateAsync(vehicle);
    }

    public async Task DeleteVehicleAsync(int id, int userId)
    {
        var vehicle = await _vehicleRepository.GetVehicleByIdAsync(id, userId);

        if (vehicle == null)
        {
            throw new KeyNotFoundException($"Vehicle with ID {id} not found or access denied.");
        }

        await _vehicleRepository.DeleteAsync(vehicle);
    }
}