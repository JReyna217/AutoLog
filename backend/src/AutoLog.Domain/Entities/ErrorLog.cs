using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoLog.Domain.Entities;

/// <summary>
/// Logs for both handled (custom) and unhandled exceptions.
/// </summary>
public class ErrorLog : BaseEntity
{
    [Required]
    [MaxLength(15)]
    public string OriginLayer { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string MainObject { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string MethodName { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string? Description { get; set; }

    [Required]
    [MaxLength(4000)]
    public string ErrorMessage { get; set; } = string.Empty;

    [Required]
    public DateTime ErrorDate { get; set; } = DateTime.UtcNow;
    
    // Foreign Key
    public int? UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; } 

    [Required]
    public Guid IncidentNumber { get; set; } = Guid.NewGuid();
}