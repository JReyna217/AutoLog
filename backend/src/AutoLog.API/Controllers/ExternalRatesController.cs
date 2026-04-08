using System.Diagnostics;
using AutoLog.Infrastructure.Integrations.DOF.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoLog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExternalRatesController : ControllerBase
{
    private readonly IDofIntegrationService _dofService;

    public ExternalRatesController(IDofIntegrationService dofService)
    {
        _dofService = dofService;
    }

    [HttpGet("dof/{date}")]
    public async Task<IActionResult> GetDofRate(DateTime date)
    {
        var rate = await _dofService.GetUsdExchangeRateAsync(date);
        
        if (rate.HasValue)
        {
            return Ok(new { rateValue = rate.Value });
        }

        // We return a 204 Not Found status code if the DOF has no data for that day
        return NoContent(); 
    }
}