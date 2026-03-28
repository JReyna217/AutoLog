using AutoLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AutoLog.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Vehicle> Vehicles { get; set; } = null!;
    public DbSet<FuelLog> FuelLogs { get; set; } = null!;
    public DbSet<ExchangeRate> ExchangeRates { get; set; } = null!;
    public DbSet<ErrorLog> ErrorLogs { get; set; } = null!;
    public DbSet<SystemResponse> SystemResponses { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- Fluent API: Unique Index Configuration ---
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<ExchangeRate>()
            .HasIndex(e => e.Date)
            .IsUnique();

        modelBuilder.Entity<ErrorLog>()
            .HasIndex(e => e.IncidentNumber)
            .IsUnique();

        modelBuilder.Entity<SystemResponse>()
            .HasIndex(s => s.Code)
            .IsUnique();
    }

    // --- Interceptor for automating audit fields ---
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Applies to all entities that inherit from BaseEntity and have been inserted or modified
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && (
                    e.State == EntityState.Added || 
                    e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            var entity = (BaseEntity)entityEntry.Entity;

            if (entityEntry.State == EntityState.Added)
            {
                entity.CreatedAt = DateTime.UtcNow;
            }
            else if (entityEntry.State == EntityState.Modified)
            {
                entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}