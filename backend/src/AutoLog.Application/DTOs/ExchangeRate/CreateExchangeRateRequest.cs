using System.ComponentModel.DataAnnotations;

namespace AutoLog.Application.DTOs.ExchangeRate;

public class CreateExchangeRateRequest
{
    [Required]
    public DateOnly Date { get; set; }

    [Required]
    [Range(0.01, 100.00)]
    public decimal UsdToMxnRate { get; set; }
}