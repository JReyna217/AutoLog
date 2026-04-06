using System.ComponentModel.DataAnnotations;

namespace AutoLog.Application.DTOs.FuelLog;

public class CreateFuelLogRequest
{
    [Required]
    public int VehicleId { get; set; }

    [Required]
    public DateTime FillUpDate { get; set; }

    [Required]
    public bool IsOdometerInMiles { get; set; }
    
    [Required]
    [Range(0, double.MaxValue)]
    public decimal CurrentOdometer { get; set; }

    [Required]
    public bool IsVolumeInGallons { get; set; }
    
    [Required]
    [Range(0.1, 1000)]
    public decimal InputVolume { get; set; }

    [Required]
    public bool IsPaidInUsd { get; set; }
    
    [Required]
    [Range(0, double.MaxValue)]
    public decimal InputCost { get; set; }

    public decimal? AppliedExchangeRate { get; set; }

    [Required]
    public bool IsFullTank { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }
}