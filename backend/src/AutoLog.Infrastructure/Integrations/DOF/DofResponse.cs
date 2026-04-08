using System.Text.Json.Serialization;

namespace AutoLog.Infrastructure.Integrations.DOF;

public class DofResponse
{
    [JsonPropertyName("messageCode")]
    public int MessageCode { get; set; }

    [JsonPropertyName("response")]
    public string Response { get; set; } = string.Empty;

    [JsonPropertyName("ListaIndicadores")]
    public List<DofIndicator>? ListaIndicadores { get; set; }
}