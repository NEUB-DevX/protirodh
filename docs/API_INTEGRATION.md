# Vaccination Management System - API Integration Guide

## Overview
This document explains how the frontend connects to the backend API to fetch and manage vaccination data.

## Setup

### 1. Backend Setup
```bash
cd protirodh-backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run start
```

The backend server will run on `http://localhost:5000` by default.

### 2. Frontend Setup
```bash
# In the root directory
cp .env.local.example .env.local
```

Edit `.env.local` and set:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/center/login` - Center login
- `POST /api/auth/center/verify-token` - Verify JWT token
- `POST /api/auth/center/logout` - Logout

### Hub Management (Admin Routes)
All hub routes require admin authentication token in headers:
```
Authorization: Bearer <admin_token>
```

#### Vaccines
- `GET /api/hub/vaccines` - Get all vaccines
- `POST /api/hub/vaccines` - Create vaccine
- `PUT /api/hub/vaccines/:id` - Update vaccine
- `DELETE /api/hub/vaccines/:id` - Delete vaccine
- `GET /api/hub/vaccines/:id` - Get vaccine by ID

#### Centers
- `GET /api/hub/centers` - Get all centers
- `POST /api/hub/centers` - Create center
- `PUT /api/hub/centers/:id` - Update center
- `DELETE /api/hub/centers/:id` - Delete center
- `GET /api/hub/centers/:id` - Get center by ID

#### Stock Requests
- `GET /api/hub/stock-requests` - Get all stock requests
- `PUT /api/hub/stock-requests/:id/approve` - Approve request
- `PUT /api/hub/stock-requests/:id/reject` - Reject request
- `GET /api/hub/stock-requests/:id` - Get request by ID

#### Analytics
- `GET /api/hub/analytics/dashboard` - Get dashboard analytics

### Center Operations (Center Routes)
All center routes require center authentication token in headers:
```
Authorization: Bearer <center_token>
```

- `GET /api/center/stock-requests` - Get center's stock requests
- `POST /api/center/stock-requests` - Create stock request
- `GET /api/center/vaccines` - Get available vaccines
- `GET /api/center/profile` - Get center profile
- `PUT /api/center/profile` - Update center profile
- `GET /api/center/dashboard` - Get center dashboard

## Frontend API Usage

### API Client (`lib/api/hubApi.ts`)
The frontend uses a centralized API client for all backend calls:

```typescript
import { vaccineApi, centerApi, stockRequestApi, analyticsApi } from '@/lib/api/hubApi';

// Get all vaccines
const response = await vaccineApi.getAll();
if (response.data) {
  setVaccines(response.data);
}

// Create a vaccine
await vaccineApi.create({
  name: 'Pfizer-BioNTech',
  manufacturer: 'Pfizer Inc.',
  doses: 2,
  temperature: '-70°C',
  efficacy: '95%'
});

// Delete a vaccine
await vaccineApi.delete(vaccineId);
```

### Type Safety
All API responses and requests use TypeScript types defined in `lib/types/hub.types.ts`:

```typescript
interface Vaccine {
  _id?: string;
  name: string;
  manufacturer: string;
  doses: number;
  temperature: string;
  efficacy: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
```

### Authentication
The API client automatically includes JWT tokens from localStorage:

```typescript
const token = localStorage.getItem('adminToken');
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## Hub Dashboard Integration

The Hub Dashboard (`app/(dashboard)/hub/page.tsx`) demonstrates complete API integration:

### Data Loading
```typescript
useEffect(() => {
  loadAllData();
}, []);

const loadAllData = async () => {
  const [vaccinesRes, centersRes, stocksRes, analyticsRes] = await Promise.all([
    vaccineApi.getAll(),
    centerApi.getAll(),
    stockRequestApi.getAll(),
    analyticsApi.getDashboard(),
  ]);
  
  if (vaccinesRes.data) setVaccines(vaccinesRes.data);
  if (centersRes.data) setCenters(centersRes.data);
  // ...
};
```

### CRUD Operations
```typescript
// Create
const handleVaccineSubmit = async (e) => {
  e.preventDefault();
  await vaccineApi.create(vaccineForm);
  await loadAllData();
  closeModal();
};

// Update
await vaccineApi.update(vaccineId, updatedData);

// Delete
await vaccineApi.delete(vaccineId);
```

### Error Handling
```typescript
try {
  await vaccineApi.create(data);
} catch (err) {
  console.error('Error:', err);
  alert(err instanceof Error ? err.message : 'Operation failed');
}
```

## Testing

### 1. Test Backend Health
```bash
curl http://localhost:5000/api/health
```

### 2. Test API Endpoints
```bash
# Get all vaccines (requires admin token)
curl -H "Authorization: Bearer <token>" \
     http://localhost:5000/api/hub/vaccines
```

### 3. Monitor Frontend Network Calls
- Open browser DevTools → Network tab
- Perform actions in the dashboard
- Check API calls and responses

## Common Issues

### CORS Errors
If you see CORS errors, ensure the backend `.env` has:
```
CLIENT_URL=http://localhost:3000
```

### Authentication Errors
- Verify JWT tokens are stored in localStorage
- Check token expiration (default: 7 days)
- Ensure correct headers are sent

### Connection Refused
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Ensure no firewall blocking localhost connections

## Development Tips

### Mock vs Real Data
The frontend automatically switches from mock data to real API data when:
1. Backend is running
2. API URL is configured
3. Authentication tokens are present

### Hot Reload
- Frontend changes: Automatic via Next.js
- Backend changes: Automatic via nodemon
- Database changes: Restart backend if schema changes

### Debugging
```typescript
// Enable API debugging
const response = await vaccineApi.getAll();
console.log('API Response:', response);
```

## Production Deployment

### Environment Variables
```bash
# Production backend
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
PORT=5000

# Production frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### Security
- Always use HTTPS in production
- Rotate JWT secrets regularly
- Implement rate limiting
- Enable CORS only for trusted domains
- Use environment-specific tokens

## Next Steps

1. **Center Dashboard**: Implement similar API integration for center operations
2. **Staff Dashboard**: Connect staff pages to appointment APIs
3. **Real-time Updates**: Add Socket.IO for live data updates
4. **Caching**: Implement React Query for better data management
5. **Offline Support**: Add service workers for offline functionality
