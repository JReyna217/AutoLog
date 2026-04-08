using System.Text.Json.Serialization;

namespace AutoLog.Infrastructure.Integrations.DOF;

public class DofIndicator
{
    [JsonPropertyName("codTipoIndicador")]
    public int CodTipoIndicador { get; set; }

    [JsonPropertyName("valor")]
    public string Valor { get; set; } = string.Empty;
}