using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoLog.Domain.Entities;

/// <summary>
/// Represents a vehicle owned by a user.
/// </summary>
public class Vehicle : BaseEntity
{
    // Foreign Key
    [Required]
    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

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

    // Navigation property
    public ICollection<FuelLog> FuelLogs { get; set; } = new List<FuelLog>();
}