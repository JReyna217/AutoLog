using System.ComponentModel.DataAnnotations;

namespace AutoLog.Domain.Entities;

/// <summary>
/// Catalog for system responses and controlled error codes.
/// </summary>
public class SystemResponse : BaseEntity
{
    [MaxLength(6)]
    public string Code { get; set; } = string.Empty; 
    
    [Required]
    public string MessageEs { get; set; } = string.Empty;

    [Required]
    public string MessageEn { get; set; } = string.Empty;
}