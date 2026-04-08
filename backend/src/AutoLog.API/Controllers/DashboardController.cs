using System.Security.Claims;
using AutoLog.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoLog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary([FromQuery] int? vehicleId, [FromQuery] int? month, [FromQuery] int? year)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token.");
        }
        
        var summary = await _dashboardService.GetSummaryAsync(userId, vehicleId, month, year);
        return Ok(summary);
    }
}