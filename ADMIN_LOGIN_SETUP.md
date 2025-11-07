# Admin Login Setup Guide

## Overview
The admin login page (`/admin-login`) provides a unified authentication interface for three different roles:
- **Hub Admin** - Central management dashboard
- **Center** - Vaccination center dashboard  
- **Staff** - Staff member dashboard

## Backend Setup

### 1. Hub Admin Credentials
Hub admin credentials are stored in environment variables. Add to your `.env` file:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
```

### 2. Center Credentials
Centers are managed by the Hub Admin. When a hub admin creates a center:
- The center receives a unique `_id` (MongoDB ObjectId)
- A password is assigned by the hub admin
- Centers login using: `centerId` + `password`

### 3. Staff Credentials  
Staff members are managed by Center Admins. When a center creates staff:
- Staff receives a unique `staffId` (e.g., STAFF001)
- A password is assigned by the center admin
- Staff login using: `staffId` + `password`

## API Endpoints

### Hub Login
```
POST /api/auth/hub/login
Body: { "username": "admin", "password": "password" }
```

### Center Login
```
POST /api/auth/center/login
Body: { "centerId": "center_mongodb_id", "password": "password" }
```

### Staff Login
```
POST /api/auth/staff/login
Body: { "staffId": "STAFF001", "password": "password" }
```

## Database Models

### Staff Model
Created at: `src/models/Staff.model.js`

Fields:
- `staffId` (String, unique) - Staff identifier
- `password` (String) - Plain text password
- `name` (String) - Full name
- `email` (String) - Email address
- `phone` (String) - Phone number
- `role` (Enum) - Vaccinator, Nurse, Doctor, Administrator
- `centerId` (ObjectId) - Reference to Center
- `status` (Enum) - active, inactive
- `lastLogin` (Date) - Last login timestamp

## Frontend Routes

- `/admin-login` - Unified login page with role selection
- `/hub` - Hub dashboard (after hub admin login)
- `/center` - Center dashboard (after center login)
- `/staff` - Staff dashboard (after staff login)

## Token Storage

Tokens are stored in localStorage with role-specific keys:
- Hub: `adminToken`
- Center: `centerToken`
- Staff: `staffToken`

## Manual Database Setup

To create the initial hub admin, the credentials are read from environment variables.
No database entry is needed for hub admin.

For testing centers, you can manually insert into MongoDB:
```javascript
db.centers.insertOne({
  name: "Test Center",
  address: "123 Test St",
  password: "test123",
  status: "active",
  capacity: 500,
  staff: 5
})
```

For testing staff, you can manually insert into MongoDB:
```javascript
db.staffs.insertOne({
  staffId: "STAFF001",
  password: "staff123",
  name: "Test Staff",
  role: "Vaccinator",
  centerId: ObjectId("center_id_here"),
  status: "active"
})
```
