using AutoLog.Application.Interfaces.Repositories;
using AutoLog.Domain.Entities;
using AutoLog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Infrastructure.Repositories;

public class FuelLogRepository : IFuelLogRepository
{
    private readonly ApplicationDbContext _context;

    public FuelLogRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<FuelLog>> GetAllByVehicleIdAsync(int vehicleId)
    {
        return await _context.FuelLogs
            .Where(f => f.VehicleId == vehicleId && !f.IsDeleted)
            .OrderByDescending(f => f.FillUpDate)
            .ToListAsync();
    }

    public async Task<FuelLog?> GetByIdAsync(int id)
    {
        return await _context.FuelLogs
            .FirstOrDefaultAsync(f => f.Id == id && !f.IsDeleted);
    }

    public async Task<FuelLog?> GetLastFillUpAsync(int vehicleId)
    {
        return await _context.FuelLogs
            .Where(f => f.VehicleId == vehicleId && !f.IsDeleted)
            .OrderByDescending(f => f.FillUpDate)
            .FirstOrDefaultAsync();
    }

    public async Task<FuelLog> AddAsync(FuelLog fuelLog)
    {
        fuelLog.CreatedAt = DateTime.UtcNow;
        _context.FuelLogs.Add(fuelLog);
        await _context.SaveChangesAsync();
        return fuelLog;
    }

    public async Task UpdateAsync(FuelLog fuelLog)
    {
        fuelLog.UpdatedAt = DateTime.UtcNow;
        _context.FuelLogs.Update(fuelLog);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(FuelLog fuelLog)
    {
        fuelLog.IsDeleted = true;
        fuelLog.UpdatedAt = DateTime.UtcNow;
        
        _context.FuelLogs.Update(fuelLog);
        await _context.SaveChangesAsync();
    }
}