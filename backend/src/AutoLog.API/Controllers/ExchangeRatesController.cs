using AutoLog.Application.DTOs.ExchangeRate;
using AutoLog.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoLog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExchangeRatesController : ControllerBase
{
    private readonly IExchangeRateService _exchangeRateService;

    public ExchangeRatesController(IExchangeRateService exchangeRateService)
    {
        _exchangeRateService = exchangeRateService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var rates = await _exchangeRateService.GetAllAsync();
        return Ok(rates);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateExchangeRateRequest request)
    {
        var createdRate = await _exchangeRateService.CreateAsync(request);
        return CreatedAtAction(nameof(GetAll), new { id = createdRate.Id }, createdRate);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateExchangeRateRequest request)
    {
        await _exchangeRateService.UpdateAsync(id, request);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _exchangeRateService.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("date/{date}")]
    public async Task<IActionResult> GetByDate(DateOnly date)
    {
        var rate = await _exchangeRateService.GetByDateAsync(date);
        return Ok(rate);
    }
}