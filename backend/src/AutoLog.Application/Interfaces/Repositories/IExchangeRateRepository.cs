using AutoLog.Domain.Entities;

namespace AutoLog.Application.Interfaces.Repositories;

public interface IExchangeRateRepository
{
    Task<IEnumerable<ExchangeRate>> GetAllAsync();
    Task<ExchangeRate?> GetByIdAsync(int id);
    Task<ExchangeRate> AddAsync(ExchangeRate exchangeRate);
    Task UpdateAsync(ExchangeRate exchangeRate);
    Task DeleteAsync(ExchangeRate exchangeRate);
}