using AutoLog.Application.Interfaces.Repositories;
using AutoLog.Domain.Entities;
using AutoLog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Infrastructure.Repositories;

/// <summary>
/// Entity Framework implementation of the vehicle repository.
/// </summary>
public class VehicleRepository : IVehicleRepository
{
    private readonly ApplicationDbContext _context;

    public VehicleRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Vehicle>> GetVehiclesByUserIdAsync(int userId)
    {
        // Fetch all vehicles belonging to the specific user, ordered by year descending
        return await _context.Vehicles
            .AsNoTracking()
            .Where(v => v.UserId == userId)
            .OrderByDescending(v => v.Year)
            .ToListAsync();
    }

    public async Task<Vehicle?> GetVehicleByIdAsync(int id, int userId)
    {
        // Ensure the vehicle exists AND belongs to the requesting user
        return await _context.Vehicles
            .FirstOrDefaultAsync(v => v.Id == id && v.UserId == userId);
    }

    public async Task<Vehicle> AddAsync(Vehicle vehicle)
    {
        await _context.Vehicles.AddAsync(vehicle);
        await _context.SaveChangesAsync();
        return vehicle;
    }

    public async Task UpdateAsync(Vehicle vehicle)
    {
        _context.Vehicles.Update(vehicle);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Vehicle vehicle)
    {
        _context.Vehicles.Remove(vehicle);
        await _context.SaveChangesAsync();
    }
}