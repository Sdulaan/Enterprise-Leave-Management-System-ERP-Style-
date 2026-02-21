# Enterprise Leave Management System (ERP Style)

A full-stack leave management platform with role-based workflows for Employees, Managers, and HR Admins.

## Overview

This project provides an ERP-style leave management system with:

- Secure authentication with JWT and ASP.NET Core Identity
- Role-based access control (`Employee`, `Manager`, `HRAdmin`)
- Leave application, approval/rejection, and balance tracking
- HR administration for users and organization-wide leave visibility
- Report generation (PDF/Excel response stream)

## Tech Stack

- Backend: ASP.NET Core Web API (.NET), Entity Framework Core, SQL Server LocalDB, ASP.NET Identity, JWT, Serilog
- Frontend: React 18, React Router, Vite
- Database: SQL Server (default: `(localdb)\\mssqllocaldb`)

## Repository Structure

```text
.
|-- Backend/
|   |-- EnterpriseLeaveManagement.API/        # Web API (controllers, middleware, startup)
|   |-- EnterpriseLeaveManagement.Core/       # Entities, DTOs, interfaces
|   |-- EnterpriseLeaveManagement.Data/       # DbContext, repositories, EF migrations
|   |-- EnterpriseLeaveManagement.Services/   # Business services
|   `-- EnterpriseLeaveManagement.slnx
|-- Frontend/
|   `-- client/                               # React + Vite app
|-- Database/
`-- Docs/
```

## Core Features

- Employee
- Register and log in
- Apply for leave
- View leave history and current leave balances

- Manager
- View team pending leave requests
- Approve or reject requests with comments/reason

- HR Admin
- Access all leave requests
- Manage users (view, activate/deactivate, role updates)
- Generate leave reports

## Default Roles and Seed Data

On backend startup, EF migrations are applied automatically and these roles are seeded:

- `Employee`
- `Manager`
- `HRAdmin`

A default HR admin is also seeded:

- Email: `admin@leavemanagement.com`
- Password: `Admin@123`
- Role: `HRAdmin`

## Prerequisites

- .NET SDK 8.0+ (recommended)
- Node.js 18+ and npm
- SQL Server LocalDB (or SQL Server instance)

## Configuration

### Backend (`Backend/EnterpriseLeaveManagement.API/appsettings.json`)

Update the values below for your environment:

- `ConnectionStrings:DefaultConnection`
- `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience`, `Jwt:DurationInMinutes`
- `EmailSettings` (if email features are enabled)

Default backend URL from launch profile:

- `http://localhost:5062`

### Frontend

Frontend Vite dev server is configured at:

- `http://localhost:3000`

API calls use:

- Base URL: `http://localhost:5062/api` (in `Frontend/client/src/api/api.js`)
- Vite proxy `/api -> http://localhost:5062` (in `Frontend/client/vite.config.js`)

## Run Locally

### 1) Start the backend API

```powershell
cd Backend
# Optional build
 dotnet build EnterpriseLeaveManagement.slnx -nologo

# Run API
 dotnet run --project "EnterpriseLeaveManagement.API/EnterpriseLeaveManagement.API.csproj"
```

The API starts on `http://localhost:5062` (Development profile).

Swagger is available in Development at:

- `http://localhost:5062/swagger`

### 2) Start the frontend

```powershell
cd Frontend/client
npm install
npm run dev
```

Open:

- `http://localhost:3000`

## API Endpoints (Summary)

Base route: `/api`

- Auth
- `POST /auth/register`
- `POST /auth/login`

- Leave (authorized)
- `POST /leave/apply`
- `GET /leave/history`
- `GET /leave/balance`
- `GET /leave/team-pending` (`Manager`, `HRAdmin`)
- `POST /leave/{id}/approve` (`Manager`, `HRAdmin`)
- `POST /leave/{id}/reject` (`Manager`, `HRAdmin`)
- `POST /leave/generate-report` (`HRAdmin`)
- `GET /leave/all` (`HRAdmin`)

- Users (`HRAdmin` only)
- `GET /users`
- `GET /users/{id}`
- `PUT /users/{id}/role`
- `PUT /users/{id}/deactivate`
- `PUT /users/{id}/activate`

## Frontend Scripts

From `Frontend/client`:

- `npm run dev` - start development server
- `npm run build` - build production assets
- `npm run preview` - preview production build

## Logging and Error Handling

- Serilog writes to console and rolling files under:
- `Backend/EnterpriseLeaveManagement.API/logs/`

- Global exception middleware:
- `Backend/EnterpriseLeaveManagement.API/Middleware/ExceptionHandlingMiddleware.cs`

## Troubleshooting

- Port mismatch
- Ensure backend is running on `http://localhost:5062` and frontend on `http://localhost:3000`.

- CORS issues
- Backend CORS currently allows `http://localhost:3000`.

- Database connection errors
- Verify LocalDB/SQL Server availability and `DefaultConnection` value.

- JWT validation failures
- Ensure `Jwt:Key`, issuer, and audience are consistent and unchanged between token issuance and validation.

## Notes

- One frontend method currently calls `'/api/leave/all'` without the configured `BASE_URL`, relying on Vite proxy during development. For production hosting without proxy, keep API base URLs consistent.
- HTTPS redirection is currently commented out in `Program.cs`.

## License

No license file is currently included in this repository.
