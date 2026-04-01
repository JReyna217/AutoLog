using AutoLog.Application.Interfaces.Repositories;
using AutoLog.Domain.Entities;
using AutoLog.Domain.Exceptions;
using MediatR;

namespace AutoLog.Application.Features.Auth.Commands;

// 1. The Command (Data carrier)
public record RegisterUserCommand(string Email, string FullName, string Password) : IRequest<bool>;

// 2. The Handler (Business logic)
public class RegisterUserCommandHandler(IUserRepository userRepository) : IRequestHandler<RegisterUserCommand, bool>
{
    public async Task<bool> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var exists = await userRepository.ExistsByEmailAsync(request.Email, cancellationToken);
        
        if (exists)
            throw new CustomAppException("e00400", "User with this email already exists.");

        var user = new User
        {
            Email = request.Email,
            FullName = request.FullName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        await userRepository.AddAsync(user, cancellationToken);
        return true;
    }
}