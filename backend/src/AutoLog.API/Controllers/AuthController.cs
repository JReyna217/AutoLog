using AutoLog.Application.DTOs.Auth;
using AutoLog.Application.Features.Auth.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AutoLog.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController(IMediator mediator) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequestDto request)
    {
        var command = new RegisterUserCommand(request.Email, request.FullName, request.Password);
        await mediator.Send(command);
        return Ok(new { Message = "User registered successfully." });
    }

    [HttpPost("login")]
    public async Task<ActionResult<TokenResponseDto>> Login(LoginRequestDto request)
    {
        var command = new LoginUserCommand(request.Email, request.Password);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<TokenResponseDto>> Refresh(RefreshTokenRequestDto request)
    {
        var command = new RefreshTokenCommand(request.AccessToken, request.RefreshToken);
        var result = await mediator.Send(command);
        return Ok(result);
    }
}