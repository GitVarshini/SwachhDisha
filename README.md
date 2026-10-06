# SwachhDisha

## Smart Waste Issue Reporting & Monitoring System

SwachhDisha is a civic technology web application that helps citizens report waste-related problems and enables municipal authorities to monitor, verify, and resolve those reports through a centralized dashboard.

The system provides waste issue reporting, map-based visualization, report tracking, administrative status management, and analytics.

---

## Problem Statement

Waste accumulation and illegal dumping can create health, environmental, and sanitation problems. In many communities, citizens have limited visibility into whether reported waste issues are being addressed.

SwachhDisha provides a digital platform where citizens can report waste problems and authorities can manage the complete resolution workflow.

---

## Objectives

* Allow citizens to report waste-related problems.
* Record the location and details of reported waste.
* Categorize reports based on waste type and severity.
* Allow administrators to review and manage reports.
* Track reports from submission to resolution.
* Display waste reports and hotspots on interactive maps.
* Provide analytics for understanding waste patterns.
* Provide awareness resources related to waste management.

---

## Key Features

### Citizen Features

* View the SwachhDisha dashboard
* Submit waste reports
* Select waste category
* Specify severity
* Provide location, address, ward, and description
* Submit reports anonymously
* View submitted reports
* Track report status
* View report timeline
* View waste reports on an interactive map
* View high-risk waste areas
* Access waste-management awareness information

### Administrator Features

* Secure administrator login
* View overall waste-report statistics
* View and filter submitted reports
* Verify reports
* Move verified reports to `IN_PROGRESS`
* Mark completed reports as `RESOLVED`
* Reject invalid reports
* View report timelines
* View waste reports on a map
* View analytics by category and status
* Monitor waste hotspots

---

## Report Workflow

A report follows a controlled status workflow:

```text
PENDING
   |
   +----> REJECTED
   |
   v
VERIFIED
   |
   v
IN_PROGRESS
   |
   v
RESOLVED
```

This allows authorities to track the complete lifecycle of a citizen complaint.

---

## Technology Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Leaflet
* OpenStreetMap
* Recharts
* Lucide Icons
* React Router

### Backend

* Node.js
* Express.js
* REST API
* JWT Authentication
* bcryptjs
* Multer

### Database

* MySQL
* mysql2

### Development & Deployment

* Git
* GitHub
* AWS EC2
* Ubuntu Server
* Nginx
* PM2

---

## System Architecture

```text
                    ┌──────────────────────┐
                    │       Citizen        │
                    └──────────┬───────────┘
                               │
                               v
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │  Vite + TypeScript   │
                    └──────────┬───────────┘
                               │
                          REST API
                               │
                               v
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │      Node.js         │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 v                           v
       ┌──────────────────┐       ┌──────────────────┐
       │      MySQL       │       │ Authentication   │
       │     Database     │       │ JWT + bcryptjs   │
       └──────────────────┘       └──────────────────┘
                 │
                 v
       ┌──────────────────────┐
       │ Reports / Timelines  │
       │ Hotspots / Analytics │
       └──────────────────────┘
```

---

## Project Structure

```text
SwachhDisha/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── mapController.js
│   │   └── reportController.js
│   │
│   ├── db/
│   │   ├── initDb.js
│   │   ├── schema.sql
│   │   └── seed.sql
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── mapRoutes.js
│   │   └── reportRoutes.js
│   │
│   ├── utils/
│   │   └── idGenerator.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── pages/
│   ├── services/
│   │   ├── api/
│   │   └── mock/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Database Design

The backend uses MySQL to store application data.

### Users

Stores citizen and administrator accounts.

Important fields:

```text
id
name
email
password_hash
phone
role
created_at
updated_at
```

Roles:

```text
CITIZEN
ADMIN
```

### Waste Reports

Stores citizen-submitted waste complaints.

Important fields include:

```text
id
category
severity
description
address
ward
latitude
longitude
photo_url
status
anonymous
reporter_id
reporter_name
reporter_contact
created_at
updated_at
```

### Report Updates

Stores the status history of each report.

```text
id
report_id
status
message
updated_by
created_at
```

### Hotspot Areas

Stores information about waste-prone areas.

```text
id
name
ward
report_count
severity
common_category
last_reported_at
latitude
longitude
description
resolution_rate
```

---

## REST API

The backend uses `/api` as the API prefix.

### Authentication

```text
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

### Reports

```text
GET  /api/reports
GET  /api/reports/:id
GET  /api/reports/my-reports
POST /api/reports
GET  /api/reports/:id/timeline
```

### Administrative Report Management

```text
PATCH /api/admin/reports/:id/verify
PATCH /api/admin/reports/:id/in-progress
PATCH /api/admin/reports/:id/resolve
PATCH /api/admin/reports/:id/reject
```

### Maps

```text
GET /api/map/reports
GET /api/map/hotspots
```

### Analytics

```text
GET /api/analytics/summary
GET /api/analytics/categories
GET /api/analytics/status
GET /api/analytics/time-series
GET /api/analytics/wards
```

### Health Check

```text
GET /api/health
```

---

## Local Setup

### Prerequisites

Install:

* Node.js
* npm
* MySQL
* Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/GitVarshini/SwachhDisha.git
cd SwachhDisha
```

---

### 2. Install Frontend Dependencies

```bash
npm install --legacy-peer-deps
```

---

### 3. Configure Backend

Move into the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=swachhdisha

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
```

Do not commit `.env` to GitHub.

---

### 4. Initialize the Database

From the `backend` directory:

```bash
npm run init-db
```

This creates the SwachhDisha database, tables, and seed data.

---

### 5. Start the Backend

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "SwachhDisha API is running"
}
```

---

### 6. Start the Frontend

Open another terminal and return to the project root:

```bash
cd SwachhDisha
```

Start the frontend:

```bash
npm run dev
```

The frontend runs through the Vite development server.

---

## Admin Access

The development database includes a seeded administrator account.

```text
Email: admin@swachhdisha.com
Password: admin123
```

For production deployment, the default administrator credentials should be changed.

---

## Environment Variables

### Frontend

The frontend API URL can be configured using:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend

The backend requires:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=swachhdisha
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
```

Environment files containing passwords and secrets are excluded from Git using `.gitignore`.

---

## Security

SwachhDisha implements several basic security mechanisms:

* JWT-based authentication
* Password hashing using bcryptjs
* Role-based authorization
* Protected administrator routes
* Environment variables for sensitive configuration
* Database credentials kept outside source control
* CORS configuration
* Input validation at the API layer
* Controlled report status transitions

---

## Deployment Architecture

The production deployment is designed around an AWS Ubuntu server.

```text
                   Internet
                       |
                       v
                ┌────────────┐
                │   Nginx    │
                │   :80/:443 │
                └─────┬──────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          v                       v
   React Static Files       Node.js/Express
                               :5000
                                  |
                                  v
                               MySQL
```

The database and backend do not need to be publicly exposed.

---

## Git Workflow

The project uses Git and GitHub for version control.

```bash
git add .
git commit -m "Update project"
git push
```

The production server can obtain the latest application code using:

```bash
git pull origin main
```

---

## Testing

The implemented application workflow has been tested locally.

### Authentication

* Administrator login
* JWT authentication
* Protected admin routes

### Report Management

* Citizen report submission
* Automatic report ID generation
* My Reports retrieval
* Admin report queue
* Report verification
* In-progress status
* Resolution
* Report timeline

### Map

* Waste report markers
* Waste hotspot visualization

### Analytics

* Summary statistics
* Category statistics
* Status statistics

---

## Example Report Lifecycle

```text
Citizen
   |
   | Submit waste report
   v
PENDING
   |
   | Admin verifies
   v
VERIFIED
   |
   | Admin starts action
   v
IN_PROGRESS
   |
   | Waste issue resolved
   v
RESOLVED
```

---

## Future Enhancements

Possible future improvements include:

* Image upload and storage using AWS S3
* Automatic severity classification
* Advanced GIS and spatial queries
* Real-time notifications
* Email/SMS notifications
* Multi-city support
* Advanced hotspot prediction
* Mobile application
* Public transparency dashboard
* Automated analytics refresh
* Improved administrator role management

---

## Project Status

**Current status: Functional full-stack application**

The application currently includes:

* React frontend
* Node.js/Express backend
* MySQL database
* JWT authentication
* Citizen reporting
* Administrative workflow
* Report timelines
* Interactive maps
* Analytics
* GitHub version control
* AWS deployment preparation

---

## License

This project is developed as an academic/educational project.
