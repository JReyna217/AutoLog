using System;
using System.Globalization;
using System.Net.Http.Json;
using AutoLog.Infrastructure.Integrations.DOF.Interfaces;

namespace AutoLog.Infrastructure.Integrations.DOF.Services;

public class DofIntegrationService : IDofIntegrationService
{
    private readonly HttpClient _httpClient;

    public DofIntegrationService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://sidof.segob.gob.mx/dof/sidof/indicadores/");
    }

    public async Task<decimal?> GetUsdExchangeRateAsync(DateTime date)
    {
        try
        {
            // The DOF expects the format dd-mm-yyyy
            string dateStr = date.ToString("dd-MM-yyyy");
            
            var response = await _httpClient.GetFromJsonAsync<DofResponse>(dateStr);

            if (response?.MessageCode == 200 && response.ListaIndicadores != null)
            {
                // Code 158 corresponds to the U.S. dollar (USD)
                var usdIndicator = response.ListaIndicadores.FirstOrDefault(x => x.CodTipoIndicador == 158);

                if (usdIndicator != null && decimal.TryParse(usdIndicator.Valor, CultureInfo.InvariantCulture, out decimal rate))
                {
                    return rate;
                }
            }
            return null;
        }
        catch (Exception)
        {
            // We return null so that the frontend leaves the field blank
            return null; 
        }
    }
}
