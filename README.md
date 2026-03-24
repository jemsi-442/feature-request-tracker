# Feature Request Tracker

Feature Request Tracker is a full-stack web application for submitting, managing, and tracking feature requests in a clean and structured workflow. The platform allows users to create requests with a title, description, priority, status, and created date, while admins can monitor activity through a dashboard, manage requests, and control user accounts.

This project was built with React.js for the frontend, Node.js and Express.js for the backend, and MySQL for the database. It focuses on clean API structure, proper validation, error handling, and a professional user experience suitable for technical assessment and portfolio presentation.

Feature Request Tracker is a feature request management application built with React.js, Node.js, Express.js, and MySQL.

## Features

- Create feature requests with:
  - Title
  - Description
  - Priority (`Low`, `Medium`, `High`)
  - Status (`Open`, `In Progress`, `Completed`)
  - Created date
- Admin dashboard with request statistics
- Admin management for updating request status and priority
- User management with role and account-status controls
- JWT authentication with validation and error handling

## Tech Stack

- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express.js
- Database: MySQL + Sequelize

## Project Structure

- `client/` - React frontend
- `server/` - Express API
- `database/` - SQL setup files

## Assessment Context

This project was developed as a technical assessment for a Feature Request Tracking System.

### Core Requirements Implemented
- Create feature requests (title, description, priority, status, created date)
- RESTful API with proper validation and error handling
- MySQL database integration
- Clean project structure (React + Node.js + Express)

### Additional Enhancements (Beyond Requirements)
- JWT-based authentication system
- Role-based access control (Admin/User)
- Admin dashboard with analytics
- User management system

These enhancements were added to demonstrate production-level thinking, scalability, and system design skills.



## Screenshots

Add your screenshots inside `docs/screenshots/` and keep names simple, for example:

- `docs/screenshots/home-page.png`
- `docs/screenshots/login-page.png`
- `docs/screenshots/feature-requests-page.png`
- `docs/screenshots/admin-dashboard.png`
- `docs/screenshots/admin-feature-requests.png`
- `docs/screenshots/admin-users.png`

After adding them, this README will display them like this:

![Home Page](docs/screenshots/home-page.png)
![Login Page](docs/screenshots/login-page.png)
![Feature Requests Page](docs/screenshots/feature-requests-page.png)
![Admin Dashboard](docs/screenshots/admin-dashboard.png)
![Admin Feature Requests](docs/screenshots/admin-feature-requests.png)
![Admin Users](docs/screenshots/admin-users.png)

## Local Setup

### 1. Install dependencies

```bash
cd /home/jaykali/feature-request-tracker
npm install

cd client
npm install

cd ../server
npm install
```

### 2. Prepare the database

If the database does not exist:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS feature_request_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

To import the prepared SQL file:

```bash
cd /home/jaykali/feature-request-tracker
mysql -u root -p < database/create_feature_request_tracker_db.sql
```

If `feature_request_tracker` already exists and you want to refresh the feature tracker tables from the prepared SQL file:

```bash
mysql -u root -p feature_request_tracker
source /home/jaykali/feature-request-tracker/database/create_feature_request_tracker_db.sql;
```

### 3. Configure environment files

Backend:

```bash
cp /home/jaykali/feature-request-tracker/server/.env.example /home/jaykali/feature-request-tracker/server/.env
```

Frontend:

```bash
cp /home/jaykali/feature-request-tracker/client/.env.example /home/jaykali/feature-request-tracker/client/.env
```

Important backend values:

```env
PORT=5001
DATABASE_URL=mysql://root:your_mysql_password@127.0.0.1:3306/feature_request_tracker
DB_NAME=feature_request_tracker
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DIALECT=mysql
DB_SYNC=true
DB_SYNC_ALTER=true
CLIENT_URL=http://localhost:5173
```

Frontend API value:

```env
VITE_API_URL=http://localhost:5001/api
```

### 4. Start the application

Backend:

```bash
cd /home/jaykali/feature-request-tracker/server
npm start
```

Frontend:

```bash
cd /home/jaykali/feature-request-tracker/client
npm run dev
```

Frontend default URL:

```txt
http://localhost:5173
```

Backend default URL:

```txt
http://localhost:5001
```

## Default Test Accounts

```txt
Admin: admin@feature-request-tracker.local / Jay442tx
```

To bootstrap the local admin account:

```bash
cd /home/jaykali/feature-request-tracker/server
npm run create-admin
```

Regular users can create their own account from the register page.

## Main API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/feature-requests`
- `POST /api/feature-requests`
- `PATCH /api/feature-requests/:id`
- `DELETE /api/feature-requests/:id`
- `GET /api/admin/dashboard`
- `GET /api/users`
- `PATCH /api/users/:id/role`
- `PATCH /api/users/:id/status`
- `PATCH /api/users/:id/password`

## Submission Checklist

- GitHub repository link
- GitHub profile or portfolio
- Screenshots of the working application
- Short demo video
- This README file
- SQL file: `database/create_feature_request_tracker_db.sql`

## Notes

- Do not commit real secrets into `.env`.
- `server/.env` and `client/.env` should stay local.
- `DB_SYNC=true` helps Sequelize create missing tables during development.
- For production, prefer `DB_SYNC_ALTER=false`.
