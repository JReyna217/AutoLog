using AutoLog.Application.DTOs.Auth;
using AutoLog.Application.Interfaces.Services;
using AutoLog.Application.Interfaces.Repositories;
using AutoLog.Domain.Exceptions;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace AutoLog.Application.Features.Auth.Commands;

// 1. The Command (Data carrier)
public record RefreshTokenCommand(string AccessToken, string RefreshToken) : IRequest<TokenResponseDto>;

// 2. The Handler (Business logic)
public class RefreshTokenCommandHandler(
    IUserRepository userRepository, 
    IJwtService jwtService, 
    IConfiguration config) : IRequestHandler<RefreshTokenCommand, TokenResponseDto>
{
    public async Task<TokenResponseDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var principal = jwtService.GetPrincipalFromExpiredToken(request.AccessToken);
        var userIdClaim = principal.FindFirst("UserId")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            throw new CustomAppException("e00401", "Invalid token claims.");
        }

        var user = await userRepository.GetByIdAsync(userId, cancellationToken);
        
        if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            throw new CustomAppException("e00401", "Invalid or expired refresh token.");
        }

        var newAccessToken = jwtService.GenerateAccessToken(user);
        var newRefreshToken = jwtService.GenerateRefreshToken();
        var refreshDays = Convert.ToDouble(config["JwtSettings:RefreshExpiryDays"]);

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(refreshDays);

        await userRepository.UpdateAsync(user, cancellationToken);

        return new TokenResponseDto { AccessToken = newAccessToken, RefreshToken = newRefreshToken };
    }
}