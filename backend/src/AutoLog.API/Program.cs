using System.Text;
using AutoLog.API.Middlewares;
using AutoLog.Application.Features.Auth.Commands;
using AutoLog.Application.Interfaces;
using AutoLog.Application.Interfaces.Repositories;
using AutoLog.Application.Interfaces.Services;
using AutoLog.Application.Services;
using AutoLog.Infrastructure.Authentication;
using AutoLog.Infrastructure.Data;
using AutoLog.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IExchangeRateRepository, ExchangeRateRepository>();
builder.Services.AddScoped<IFuelLogRepository, FuelLogRepository>();

builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IExchangeRateService, ExchangeRateService>();
builder.Services.AddScoped<IFuelLogService, FuelLogService>();

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


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"], 
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"]!))
        };
    });

builder.Services.AddAuthorization();

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
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();