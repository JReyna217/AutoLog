using AutoLog.API.Middlewares;
using AutoLog.Application.Features.Auth.Commands;
using AutoLog.Application.Interfaces;
using AutoLog.Infrastructure.Authentication;
using AutoLog.Infrastructure.Data;
using AutoLog.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Inject ApplicationDbContext using PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseNpgsql(connectionString);
});

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// CORS Configuration
var angularCorsPolicy = "AllowAngularClient";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: angularCorsPolicy,
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Register MediatR
builder.Services.AddMediatR(cfg => 
{
    // Scans the entire Application assembly to automatically find and register all Handlers
    cfg.RegisterServicesFromAssembly(typeof(RegisterUserCommand).Assembly);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); 
    
    app.MapScalarApiReference(options => 
    {
        options.WithTitle("AutoLog API")
               .WithTheme(ScalarTheme.DeepSpace)
               .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
}

app.UseExceptionHandler();

app.UseHttpsRedirection();
app.UseCors(angularCorsPolicy);
app.UseAuthorization();
app.MapControllers();

app.Run();