# AutoLog 🏎️ 📊

**AutoLog** is a full-stack web application designed to track vehicle fuel consumption and manage exchange rates. Born from the personal need to maintain an accurate digital logbook for a Mustang 2000 V6, it has evolved into a robust, containerized solution built with modern web technologies. 

It is especially useful for users living in border regions who need to track expenses across different currencies (e.g., USD/MXN).

---
<p align="center">
  <img src="https://img.shields.io/badge/.NET_10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET 10" />
  <img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white" alt="C#" />
  
  <img src="https://img.shields.io/badge/Angular_20-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 20" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</p>

## ✨ Current Features (What's Done)

At its current stage, AutoLog focuses on core data entry and security:
* **Fuel Logging:** Track every trip to the gas station, including odometer readings, fuel volume, and total cost.
* **Exchange Rate Management:** Keep a historical record of exchange rates to accurately calculate cross-currency expenses.
* **Authentication & Security:** Secure login system using JSON Web Tokens (JWT).
* **Responsive UI:** A modern, mobile-friendly interface that adapts to your screen, featuring an auto-collapsing sidebar for mobile devices.
* **Containerized Deployment:** Fully Dockerized architecture (cross-compiled for AMD64) ready for production deployment.

---

## 🚀 Roadmap (What's Planned)

The following features are planned for development over the upcoming months:

* **Maintenance Module:** Track preventive and corrective maintenance records (oil changes, brakes, tires, etc.).
* **Smart Notifications:** Automated email or push alerts reminding you of upcoming maintenance based on your latest odometer readings.
* **User Preferences:** Global settings to define your default currency and preferred volume metrics (Gallons vs. Liters).
* **CI/CD Pipeline:** Automated testing and deployment workflows using GitHub Actions.

---

## 🏗️ Architecture & Tech Stack

AutoLog is built using a **Modular Monolith** architecture, adhering to Domain-Driven Design (DDD) principles to ensure scalability.

* **Backend:** .NET 10 (C# ASP.NET Core API)
* **Frontend:** Angular 20 (Standalone Components) with PrimeNG
* **Database:** PostgreSQL
* **Infrastructure:** Docker, Docker Buildx (Multi-stage builds), Nginx Reverse Proxy

---
## 💻 Local Development Setup

### 1. Prerequisites
* [.NET 10 SDK](https://dotnet.microsoft.com/)
* [Node.js (v22+)](https://nodejs.org/)
* PostgreSQL instance running locally.

### 2. Local Secrets Management (.NET API)
To keep your development environment secure and avoid committing sensitive data to GitHub, use the .NET Secret Manager:

```bash
cd backend/src/AutoLog.API
dotnet user-secrets init

# Set your local database connection
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=AutoLogDb;Username=YOUR_USER;Password=YOUR_PASS"

# Set your local JWT Secret
dotnet user-secrets set "JwtSettings:Secret" "YOUR_LOCAL_VERY_LONG_SECRET_KEY_FOR_DEV"
```

### 3. Database Migrations
Before running the API, apply the migrations to your local PostgreSQL instance:
```bash
cd backend/src/AutoLog.API

# To create a new migration (if you changed models)
dotnet ef migrations add InitialCreate --project ../AutoLog.Infrastructure --startup-project .

# To update the database
dotnet ef database update
```

### 4. Running the Project
**Backend:**
```bash
cd backend/src/AutoLog.API
dotnet run
```
**Frontend:**
```bash
cd frontend
npm install
ng serve -o
```
*App available at http://localhost:4200*

---

## 🐳 Production & Docker Deployment

AutoLog is designed to be environment-agnostic. No hardcoded secrets exist in the repository; everything is injected at runtime via environment variables.

### 1. Quick Start (Pre-built Images)
If you just want to run the application without building from source, you can use the official pre-built images hosted on Docker Hub. These images are ready for production.
```bash
docker pull julioreynadev/autolog-api:latest
docker pull julioreynadev/autolog-web:latest
```

### 2. Configuration & Secrets
In production, use the following environment variable mapping to secure your instance:

| AppSettings Key | Environment Variable | Purpose |
| :--- | :--- | :--- |
| ConnectionStrings:DefaultConnection | `ConnectionStrings__DefaultConnection` | DB Credentials |
| JwtSettings:Secret | `JwtSettings__Secret` | Key for signing tokens (min 32 chars) |
| Cors:AllowedOrigins | `Cors__AllowedOrigins__0` | Frontend URL for CORS |

### 3. Running the Containers
You must provide your secure environment variables when running the containers:

**Backend API:**
```bash
docker run -d \
  --name autolog-api \
  --restart unless-stopped \
  -p 5030:8080 \
  -e "ConnectionStrings__DefaultConnection=Host=host.docker.internal;Database=YOUR_DB;Username=YOUR_USER;Password=YOUR_PASS" \
  -e "Cors__AllowedOrigins__0=https://frontend.yourdomain.com" \
  -e "JwtSettings__Secret=YOUR_VERY_LONG_SECRET_KEY" \
  julioreyna/autolog-api:latest
```

**Frontend Web:**
```bash
docker run -d \
  --name autolog-web \
  --restart unless-stopped \
  -p 5020:80 \
  -e "API_URL=[https://api.yourdomain.com/api](https://api.yourdomain.com/api)" \
  julioreyna/autolog-web:latest
```

### 4. Advanced: Building from Source (Cross-Platform)
If you fork this repository and want to build your own images, use Docker Buildx:
```bash
# Build Frontend
docker buildx build --platform linux/amd64 \
  -t docker_username/autolog-web:v1.0.0 \
  -t docker_username/autolog-web:latest \
  --push ./frontend

# Build Backend
docker buildx build --platform linux/amd64 \
  -t docker_usernameautolog-api:v1.0.0 \
  -t docker_username/autolog-api:latest \
  --push ./backend/src
```
---

## 🌐 Nginx Configuration (Ubuntu Server)

To expose the application securely via HTTPS on Ubuntu, use the following configuration in `/etc/nginx/sites-available/autolog`:

```nginx
server {
    listen 80;
    server_name autolog.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name autolog.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/your_cert.crt;
    ssl_certificate_key /etc/nginx/ssl/your_key.key;

    location / {
        proxy_pass [http://127.0.0.1:5020](http://127.0.0.1:5020); # Docker Web Port
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 📄 License

This project is licensed under the **Apache License 2.0**. You are free to use and modify it, provided that changes are shared and original credits are maintained.

---
*Developed by Julio Reyna*
