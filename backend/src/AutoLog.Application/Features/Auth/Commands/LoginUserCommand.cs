using AutoLog.Application.DTOs.Auth;
using AutoLog.Application.Interfaces.Repositories;
using AutoLog.Application.Interfaces.Services;
using AutoLog.Domain.Exceptions;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace AutoLog.Application.Features.Auth.Commands;

// 1. The Command (Data carrier)
public record LoginUserCommand(string Email, string Password) : IRequest<TokenResponseDto>;

// 2. The Handler (Business logic)
public class LoginUserCommandHandler(
    IUserRepository userRepository, 
    IJwtService jwtService, 
    IConfiguration config) : IRequestHandler<LoginUserCommand, TokenResponseDto>
{
    public async Task<TokenResponseDto> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByEmailAsync(request.Email, cancellationToken);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new CustomAppException("ERR401", "Invalid email or password.");
        }

        var accessToken = jwtService.GenerateAccessToken(user);
        var refreshToken = jwtService.GenerateRefreshToken();
        var refreshDays = Convert.ToDouble(config["JwtSettings:RefreshExpiryDays"]);

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(refreshDays);
        
        await userRepository.UpdateAsync(user, cancellationToken);

        return new TokenResponseDto { AccessToken = accessToken, RefreshToken = refreshToken };
    }
}