# Protirodh Vaccination Management Backend

A comprehensive vaccination management system backend built with Node.js, Express, and MongoDB.

## Features

- **Center Authentication**: JWT-based authentication for vaccination centers
- **Hub Management**: Administrative dashboard for managing centers and vaccines
- **Center Operations**: Center-specific operations including stock requests
- **Stock Management**: Track vaccine inventory and stock requests
- **Real-time Notifications**: Socket.io integration for real-time updates
- **Rate Limiting**: API rate limiting for security
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Environment**: dotenv for configuration

## Project Structure

```
src/
├── controllers/
│   ├── auth/
│   │   └── centerAuth.js          # Center authentication logic
│   ├── admin/
│   │   └── hubManagement.js       # Hub/admin operations
│   └── center/
│       └── centerOperations.js    # Center-specific operations
├── middlewares/
│   └── centerAuthMiddleware.js     # JWT authentication middleware
├── models/
│   ├── Center.model.js             # Center schema and model
│   ├── Vaccine.model.js            # Vaccine schema and model
│   ├── StockRequest.model.js       # Stock request schema and model
│   └── VaccineMovement.model.js    # Vaccine movement tracking
├── routes/
│   ├── auth.routes.js              # Authentication routes
│   ├── hub.routes.js               # Hub management routes
│   ├── center.routes.js            # Center operation routes
│   └── index.js                    # Main router
└── server.js                       # Main server file
```

## API Endpoints

### Authentication
- `POST /api/auth/center/login` - Center login
- `POST /api/auth/center/verify-token` - Verify JWT token
- `POST /api/auth/center/logout` - Center logout

### Hub Management (Admin)
- `GET /api/hub/vaccines` - Get all vaccines
- `POST /api/hub/vaccines` - Create new vaccine
- `PUT /api/hub/vaccines/:id` - Update vaccine
- `DELETE /api/hub/vaccines/:id` - Delete vaccine
- `GET /api/hub/centers` - Get all centers
- `POST /api/hub/centers` - Create new center
- `PUT /api/hub/centers/:id` - Update center
- `DELETE /api/hub/centers/:id` - Delete center
- `GET /api/hub/stock-requests` - Get all stock requests
- `PUT /api/hub/stock-requests/:id/approve` - Approve stock request
- `PUT /api/hub/stock-requests/:id/reject` - Reject stock request

### Center Operations
- `GET /api/center/stock-requests` - Get center's stock requests
- `POST /api/center/stock-requests` - Create new stock request
- `GET /api/center/vaccines` - Get available vaccines
- `GET /api/center/profile` - Get center profile
- `PUT /api/center/profile` - Update center profile
- `GET /api/center/dashboard` - Get dashboard data

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd protirodh-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/protirodh
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On macOS with Homebrew
   brew services start mongodb/brew/mongodb-community
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run start
   
   # Production mode
   npm start
   ```

   The server will start on `http://localhost:5000` (or the port specified in your .env file).

### Development Scripts

```bash
# Start development server with auto-reload
npm run start

# Start production server
npm start
```

## Database Models

### Center Model
- Center information with authentication credentials
- Login attempt tracking and account locking
- Division and location information

### Vaccine Model
- Vaccine details including manufacturer and storage requirements
- Soft delete capability
- Stock quantity tracking

### Stock Request Model
- Request tracking between centers and hub
- Approval workflow with status management
- Quantity and urgency tracking

### Vaccine Movement Model
- Track vaccine shipments between locations
- Delivery status and tracking information
- Audit trail for inventory management

## Authentication Flow

1. Center logs in with ID and password
2. Server validates credentials and generates JWT token
3. Token is used for subsequent API requests
4. Middleware validates token and extracts center information
5. Protected routes use center information for authorization

## Error Handling

The API includes comprehensive error handling:
- **400**: Bad Request (validation errors, duplicate data)
- **401**: Unauthorized (invalid/expired tokens)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error (server-side issues)

## Security Features

- JWT token-based authentication
- Account locking after failed login attempts
- Rate limiting to prevent abuse
- CORS configuration for frontend integration
- Input validation and sanitization
- Password security (when implemented)

## Health Check

Check if the API is running:
```bash
GET /api/health
```

Response:
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Testing

You can test the API endpoints using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

Example curl request:
```bash
# Health check
curl http://localhost:5000/api/health

# Center login
curl -X POST http://localhost:5000/api/auth/center/login \
  -H "Content-Type: application/json" \
  -d '{"centerId": "CTR001", "password": "password123"}'
```

## Contributing

1. Follow the existing code structure and naming conventions
2. Add proper error handling for new endpoints
3. Update this README when adding new features
4. Test all endpoints before submitting changes

## License

This project is licensed under the ISC License.