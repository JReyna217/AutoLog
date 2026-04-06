namespace AutoLog.Application.DTOs.FuelLog;

public class FuelLogResponse
{
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public DateTime FillUpDate { get; set; }

    public decimal DistanceTraveledKm { get; set; }
    public decimal VolumeLiters { get; set; }
    public decimal TotalCostMxn { get; set; }
    public decimal OdometerKm { get; set; }
    public bool IsFullTank { get; set; }
}