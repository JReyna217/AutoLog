using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoLog.Domain.Entities;

/// <summary>
/// Records of fuel fill-ups. Stores normalized values and original inputs.
/// </summary>
public class FuelLog : BaseEntity
{
    // Foreign Key
    [Required]
    public int VehicleId { get; set; }

    [ForeignKey(nameof(VehicleId))]
    public Vehicle Vehicle { get; set; } = null!;

    [Required]
    public DateTime FillUpDate { get; set; }

    // --- Normalized Values ---
    [Column(TypeName = "decimal(18,2)")]
    public decimal DistanceTraveledKm { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal VolumeLiters { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalCostMxn { get; set; }
    
    // --- Original Input Values & Flags ---
    [Required]
    public bool IsOdometerInMiles { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal CurrentOdometer { get; set; } 
    
    [Required]
    public bool IsVolumeInGallons { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? OriginalVolumeGallons { get; set; }
    
    [Required]
    public bool IsPaidInUsd { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? OriginalCostUsd { get; set; }

    [Column(TypeName = "decimal(18,4)")] // 4 decimals for exchange rates
    public decimal? AppliedExchangeRate { get; set; }

    // --- Additional Data ---
    [Required]
    public bool IsFullTank { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; } 
}