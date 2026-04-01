using System.ComponentModel.DataAnnotations;

namespace AutoLog.Application.DTOs.Vehicles;

/// <summary>
/// DTO for creating a new vehicle. Notice it doesn't include UserId, 
/// as we will extract that securely from the JWT token in the controller.
/// </summary>
public class CreateVehicleDto
{
    [Required]
    [MaxLength(50)]
    public string Make { get; set; } = string.Empty; // e.g., "Ford"

    [Required]
    [MaxLength(50)]
    public string Model { get; set; } = string.Empty; // e.g., "Mustang"

    [Required]
    public int Year { get; set; } // e.g., 2000

    [Required]
    public int Cylinders { get; set; } // e.g., 6

    [Required]
    [MaxLength(10)]
    public string EngineType { get; set; } = string.Empty; // e.g., "3.7 V6"

    [Required]
    [MaxLength(20)]
    public string FuelType { get; set; } = string.Empty; // e.g., "Gasoline"

    [MaxLength(30)]
    public string? Color { get; set; }
}