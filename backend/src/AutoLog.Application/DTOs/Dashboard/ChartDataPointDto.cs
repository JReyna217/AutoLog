using System;

namespace AutoLog.Application.DTOs.Dashboard;

public class ChartDataPointDto
{
    public string Label { get; set; } = string.Empty;
    public decimal Value { get; set; }
}
