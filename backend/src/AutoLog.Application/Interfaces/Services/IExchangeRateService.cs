using AutoLog.Application.DTOs.ExchangeRate;

namespace AutoLog.Application.Interfaces.Services;

public interface IExchangeRateService
{
    Task<IEnumerable<ExchangeRateResponse>> GetAllAsync();
    Task<ExchangeRateResponse> CreateAsync(CreateExchangeRateRequest request);
    Task UpdateAsync(int id, CreateExchangeRateRequest request);
    Task DeleteAsync(int id);
}