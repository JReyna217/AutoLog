using AutoLog.Application.DTOs.FuelLog;
using AutoLog.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoLog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FuelLogsController : ControllerBase
{
    private readonly IFuelLogService _fuelLogService;

    public FuelLogsController(IFuelLogService fuelLogService)
    {
        _fuelLogService = fuelLogService;
    }

    [HttpGet("vehicle/{vehicleId}")]
    public async Task<IActionResult> GetAllByVehicle(int vehicleId)
    {
        var logs = await _fuelLogService.GetAllByVehicleIdAsync(vehicleId);
        return Ok(logs);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFuelLogRequest request)
    {
        var createdLog = await _fuelLogService.CreateAsync(request);
        return CreatedAtAction(nameof(GetAllByVehicle), new { vehicleId = createdLog.VehicleId }, createdLog);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateFuelLogRequest request)
    {
        await _fuelLogService.UpdateAsync(id, request);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _fuelLogService.DeleteAsync(id);
        return NoContent();
    }
}