# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
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

# Stage 3: Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose the default .NET 8 port
EXPOSE 8080

ENTRYPOINT ["dotnet", "AutoLog.API.dll"]
