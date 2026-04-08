using System;

namespace AutoLog.Infrastructure.Integrations.DOF.Interfaces;

public interface IDofIntegrationService
{
    Task<decimal?> GetUsdExchangeRateAsync(DateTime date);
}
