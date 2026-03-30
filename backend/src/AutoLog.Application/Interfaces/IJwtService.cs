using System.Security.Claims;
using AutoLog.Domain.Entities;

namespace AutoLog.Application.Interfaces;

/// <summary>
/// Defines the contract for JWT operations.
/// </summary>
public interface IJwtService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}