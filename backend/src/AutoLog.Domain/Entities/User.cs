using System.ComponentModel.DataAnnotations;

namespace AutoLog.Domain.Entities;

/// <summary>
/// Represents an authenticated user in the system.
/// </summary>
public class User : BaseEntity
{
    [Required]
    [MaxLength(150)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    [EmailAddress]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    // Navigation properties
    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
    public ICollection<ErrorLog> ErrorLogs { get; set; } = new List<ErrorLog>();
}