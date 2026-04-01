using AutoLog.Application.Interfaces.Repositories;
using AutoLog.Domain.Entities;
using AutoLog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Infrastructure.Repositories;

/// <summary>
/// Entity Framework Core implementation of the IUserRepository.
/// </summary>
public class UserRepository(ApplicationDbContext dbContext) : IUserRepository
{
    public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await dbContext.Users.AnyAsync(u => u.Email == email, cancellationToken);
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await dbContext.Users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }

    public async Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await dbContext.Users.FindAsync([id], cancellationToken: cancellationToken);
    }

    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await dbContext.Users.AddAsync(user, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        dbContext.Users.Update(user);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}