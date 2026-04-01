namespace AutoLog.Application.DTOs.Vehicles;

/// <summary>
/// DTO for sending vehicle data back to the client.
/// </summary>
public class VehicleResponseDto
{
    public int Id { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public int Cylinders { get; set; }
    public string EngineType { get; set; } = string.Empty;
    public string FuelType { get; set; } = string.Empty;
    public string? Color { get; set; }
}