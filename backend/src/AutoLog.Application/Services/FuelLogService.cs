using AutoLog.Application.DTOs.FuelLog;
using AutoLog.Application.Interfaces.Repositories;
using AutoLog.Application.Interfaces.Services;
using AutoLog.Domain.Entities;

namespace AutoLog.Application.Services;

public class FuelLogService : IFuelLogService
{
    private readonly IFuelLogRepository _repository;
    
    private const decimal MilesToKm = 1.60934m;
    private const decimal GallonsToLiters = 3.78541m;

    public FuelLogService(IFuelLogRepository repository)
    {
        _repository = repository;
    }

    public async Task<FuelLogResponse> CreateAsync(CreateFuelLogRequest request)
    {
        var fuelLog = new FuelLog
        {
            VehicleId = request.VehicleId,
            FillUpDate = request.FillUpDate.ToUniversalTime(),
            IsOdometerInMiles = request.IsOdometerInMiles,
            CurrentOdometer = request.CurrentOdometer,
            IsVolumeInGallons = request.IsVolumeInGallons,
            IsPaidInUsd = request.IsPaidInUsd,
            IsFullTank = request.IsFullTank,
            Notes = request.Notes,
            DistanceTraveledKm = 0 
        };

        if (request.IsVolumeInGallons)
        {
            fuelLog.OriginalVolumeGallons = request.InputVolume;
            fuelLog.VolumeLiters = request.InputVolume * GallonsToLiters;
        }
        else
        {
            fuelLog.VolumeLiters = request.InputVolume;
        }

        if (request.IsPaidInUsd)
        {
            if (!request.AppliedExchangeRate.HasValue || request.AppliedExchangeRate <= 0)
                throw new ArgumentException("Exchange rate is required when paying in USD.");
                
            fuelLog.OriginalCostUsd = request.InputCost;
            fuelLog.AppliedExchangeRate = request.AppliedExchangeRate;
            fuelLog.TotalCostMxn = request.InputCost * request.AppliedExchangeRate.Value;
        }
        else
        {
            fuelLog.TotalCostMxn = request.InputCost;
        }

        var lastLog = await _repository.GetLastFillUpAsync(request.VehicleId);
        
        if (lastLog != null)
        {
            decimal currentKm = request.IsOdometerInMiles ? request.CurrentOdometer * MilesToKm : request.CurrentOdometer;
            decimal lastKm = lastLog.IsOdometerInMiles ? lastLog.CurrentOdometer * MilesToKm : lastLog.CurrentOdometer;
            
            decimal distanceDriven = currentKm - lastKm;

            if (distanceDriven > 0)
            {
                lastLog.DistanceTraveledKm = distanceDriven;
                await _repository.UpdateAsync(lastLog);
            }
        }

        var createdLog = await _repository.AddAsync(fuelLog);

        return new FuelLogResponse
        {
            Id = createdLog.Id,
            VehicleId = createdLog.VehicleId,
            FillUpDate = createdLog.FillUpDate,
            DistanceTraveledKm = createdLog.DistanceTraveledKm,
            VolumeLiters = createdLog.VolumeLiters,
            TotalCostMxn = createdLog.TotalCostMxn,
            IsFullTank = createdLog.IsFullTank,
            OdometerKm = createdLog.IsOdometerInMiles ? createdLog.CurrentOdometer * MilesToKm : createdLog.CurrentOdometer
        };
    }

    public async Task<IEnumerable<FuelLogResponse>> GetAllByVehicleIdAsync(int vehicleId)
    {
        var logs = await _repository.GetAllByVehicleIdAsync(vehicleId);
        
        return logs.Select(log => new FuelLogResponse
        {
            Id = log.Id,
            VehicleId = log.VehicleId,
            FillUpDate = log.FillUpDate,
            DistanceTraveledKm = log.DistanceTraveledKm,
            VolumeLiters = log.VolumeLiters,
            TotalCostMxn = log.TotalCostMxn,
            IsFullTank = log.IsFullTank,
            OdometerKm = log.IsOdometerInMiles ? log.CurrentOdometer * MilesToKm : log.CurrentOdometer
        });
    }

    public async Task UpdateAsync(int id, CreateFuelLogRequest request)
    {
        var fuelLog = await _repository.GetByIdAsync(id);
        if (fuelLog == null) throw new KeyNotFoundException("Fuel log not found.");

        // To avoid recalculating the entire history going forward for now, 
        // a basic update updates the metadata. 
        // If the user changes the odometer reading for a past record, this would require 
        // recalculating the distance for the current record and the next one.
        
        fuelLog.FillUpDate = request.FillUpDate.ToUniversalTime();
        fuelLog.IsFullTank = request.IsFullTank;
        fuelLog.Notes = request.Notes;

        await _repository.UpdateAsync(fuelLog);
    }

    public async Task DeleteAsync(int id)
    {
        var fuelLog = await _repository.GetByIdAsync(id);
        if (fuelLog == null) throw new KeyNotFoundException("Fuel log not found.");

        await _repository.DeleteAsync(fuelLog);
    }
}