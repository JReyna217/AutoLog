using System;

namespace AutoLog.Application.DTOs.Dashboard;

public class MonthlyAverageDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal AverageKmL { get; set; }
}
