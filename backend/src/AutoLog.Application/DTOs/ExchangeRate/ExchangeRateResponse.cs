namespace AutoLog.Application.DTOs.ExchangeRate;

public class ExchangeRateResponse
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public decimal UsdToMxnRate { get; set; }
}