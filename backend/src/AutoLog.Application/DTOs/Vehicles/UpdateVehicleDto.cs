using System.ComponentModel.DataAnnotations;

namespace AutoLog.Application.DTOs.Vehicles;

/// <summary>
/// DTO for updating an existing vehicle.
/// </summary>
public class UpdateVehicleDto
{
    [Required]
    [MaxLength(50)]
    public string Make { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Model { get; set; } = string.Empty;

    [Required]
    public int Year { get; set; }

    [Required]
    public int Cylinders { get; set; }

    [Required]
    [MaxLength(10)]
    public string EngineType { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string FuelType { get; set; } = string.Empty;

    [MaxLength(30)]
    public string? Color { get; set; }
}