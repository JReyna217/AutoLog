using AutoLog.Application.DTOs.ExchangeRate;
using AutoLog.Application.Interfaces.Repositories;
using AutoLog.Application.Interfaces.Services;
using AutoLog.Domain.Entities;

namespace AutoLog.Application.Services;

public class ExchangeRateService : IExchangeRateService
{
    private readonly IExchangeRateRepository _repository;

    public ExchangeRateService(IExchangeRateRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ExchangeRateResponse>> GetAllAsync()
    {
        var rates = await _repository.GetAllAsync();
        return rates.Select(r => new ExchangeRateResponse
        {
            Id = r.Id,
            Date = r.Date,
            UsdToMxnRate = r.UsdToMxnRate
        });
    }

    public async Task<ExchangeRateResponse> CreateAsync(CreateExchangeRateRequest request)
    {
        var rate = new ExchangeRate
        {
            Date = request.Date,
            UsdToMxnRate = request.UsdToMxnRate
        };

        var createdRate = await _repository.AddAsync(rate);

        return new ExchangeRateResponse
        {
            Id = createdRate.Id,
            Date = createdRate.Date,
            UsdToMxnRate = createdRate.UsdToMxnRate
        };
    }

    public async Task UpdateAsync(int id, CreateExchangeRateRequest request)
    {
        var rate = await _repository.GetByIdAsync(id);
        if (rate == null) throw new KeyNotFoundException("Exchange rate not found.");

        rate.Date = request.Date;
        rate.UsdToMxnRate = request.UsdToMxnRate;

        await _repository.UpdateAsync(rate);
    }

    public async Task DeleteAsync(int id)
    {
        var rate = await _repository.GetByIdAsync(id);
        if (rate == null) throw new KeyNotFoundException("Exchange rate not found.");

        await _repository.DeleteAsync(rate);
    }
}