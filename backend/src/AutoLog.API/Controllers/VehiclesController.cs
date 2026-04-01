using System.Security.Claims;
using AutoLog.Application.DTOs.Vehicles;
using AutoLog.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoLog.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehiclesController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VehicleResponseDto>>> GetVehicles()
    {
        var userId = GetCurrentUserId();
        var vehicles = await _vehicleService.GetAllVehiclesAsync(userId);
        return Ok(vehicles);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VehicleResponseDto>> GetVehicle(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var vehicle = await _vehicleService.GetVehicleByIdAsync(id, userId);
            return Ok(vehicle);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { detail = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<VehicleResponseDto>> CreateVehicle([FromBody] CreateVehicleDto dto)
    {
        var userId = GetCurrentUserId();
        var createdVehicle = await _vehicleService.CreateVehicleAsync(userId, dto);
        
        // Returns 201 Created and the URL to get the newly created resource
        return CreatedAtAction(nameof(GetVehicle), new { id = createdVehicle.Id }, createdVehicle);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVehicle(int id, [FromBody] UpdateVehicleDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();
            await _vehicleService.UpdateVehicleAsync(id, userId, dto);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { detail = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVehicle(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            await _vehicleService.DeleteVehicleAsync(id, userId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { detail = ex.Message });
        }
    }

    /// <summary>
    /// Helper method to extract the UserId securely from the JWT claims.
    /// </summary>
    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            throw new UnauthorizedAccessException("Invalid or missing user identity in token.");
        }

        return userId;
    }
}