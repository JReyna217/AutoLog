using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoLog.Domain.Entities;

/// <summary>
/// Catalog for USD to MXN exchange rates by date.
/// </summary>
public class ExchangeRate : BaseEntity
{
    [Required]
    public DateOnly Date { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,4)")]
    public decimal UsdToMxnRate { get; set; } 
}