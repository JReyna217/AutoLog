using AutoLog.Application.Interfaces.Repositories;
using AutoLog.Domain.Entities;
using AutoLog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Infrastructure.Repositories;

public class ExchangeRateRepository : IExchangeRateRepository
{
    private readonly ApplicationDbContext _context;

    public ExchangeRateRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ExchangeRate>> GetAllAsync()
    {
        return await _context.ExchangeRates
            .Where(e => !e.IsDeleted)
            .OrderByDescending(e => e.Date)
            .ToListAsync();
    }

    public async Task<ExchangeRate?> GetByIdAsync(int id)
    {
        return await _context.ExchangeRates
            .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);
    }

    public async Task<ExchangeRate> AddAsync(ExchangeRate exchangeRate)
    {
        exchangeRate.CreatedAt = DateTime.UtcNow;
        
        _context.ExchangeRates.Add(exchangeRate);
        await _context.SaveChangesAsync();
        return exchangeRate;
    }

    public async Task UpdateAsync(ExchangeRate exchangeRate)
    {
        exchangeRate.UpdatedAt = DateTime.UtcNow;
        
        _context.ExchangeRates.Update(exchangeRate);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(ExchangeRate exchangeRate)
    {
        exchangeRate.IsDeleted = true;
        exchangeRate.UpdatedAt = DateTime.UtcNow;
        
        _context.ExchangeRates.Update(exchangeRate);
        await _context.SaveChangesAsync();
    }
}