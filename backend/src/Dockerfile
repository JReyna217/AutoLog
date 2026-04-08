# Stage 1: Build the application using .NET 10 SDK
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["AutoLog.API/AutoLog.API.csproj", "AutoLog.API/"]
COPY ["AutoLog.Application/AutoLog.Application.csproj", "AutoLog.Application/"]
COPY ["AutoLog.Domain/AutoLog.Domain.csproj", "AutoLog.Domain/"]
COPY ["AutoLog.Infrastructure/AutoLog.Infrastructure.csproj", "AutoLog.Infrastructure/"]

RUN dotnet restore "AutoLog.API/AutoLog.API.csproj"

# Copy the rest of the source code and build
COPY . .
WORKDIR "/src/AutoLog.API"
RUN dotnet build "AutoLog.API.csproj" -c Release -o /app/build

# Stage 2: Publish the application
FROM build AS publish
RUN dotnet publish "AutoLog.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final runtime image using .NET 10 ASP.NET Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose the default .NET port (Note: .NET 8+ uses 8080 by default in containers)
EXPOSE 8080

ENTRYPOINT ["dotnet", "AutoLog.API.dll"]