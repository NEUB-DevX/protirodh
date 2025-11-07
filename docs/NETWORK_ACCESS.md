# Network Access Configuration Guide

## Overview
The backend server is now configured to be accessible from any device on your local network, not just localhost.

## What Changed

### 1. Server Binding
```javascript
server.listen(PORT, '0.0.0.0', () => {
  // Server listens on all network interfaces
});
```

**Before:** `localhost` or `127.0.0.1` only (local machine only)
**After:** `0.0.0.0` (all network interfaces - accessible from network)

### 2. CORS Configuration
```javascript
app.use(cors({
  origin: '*', // Allow all origins for development
  credentials: true
}));
```

Allows requests from any device on your network.

### 3. Socket.IO Configuration
```javascript
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
```

## How to Access

### Step 1: Start the Backend Server
```bash
cd protirodh-backend
npm run start
```

### Step 2: Find Your Network IP
When the server starts, it will display all available network addresses:

```
Server running on http://localhost:4113
Also accessible on network at http://0.0.0.0:4113

Network addresses:
  eth0: http://192.168.1.100:4113
  wlan0: http://192.168.1.101:4113
```

### Step 3: Use the Network IP

**From the same machine:**
- `http://localhost:4113/api`
- `http://127.0.0.1:4113/api`

**From other devices on the same network:**
- `http://192.168.1.100:4113/api` (use your actual IP)
- `http://192.168.1.101:4113/api` (if WiFi)

### Step 4: Update Frontend Configuration

Update your frontend `.env.local`:

```env
# For same machine
NEXT_PUBLIC_API_URL=http://localhost:4113/api

# For accessing from other devices on network
NEXT_PUBLIC_API_URL=http://192.168.1.100:4113/api
```

## Common Network IPs

### Private IP Ranges:
- **192.168.x.x** - Most home routers
- **10.x.x.x** - Corporate networks
- **172.16.x.x to 172.31.x.x** - Some networks

## Testing Network Access

### From Another Device:

1. **Find your backend server IP** (shown when server starts)

2. **Test the connection:**
   ```bash
   # On another device on the same network
   curl http://192.168.1.100:4113/api
   ```

3. **Test API health:**
   ```bash
   curl http://192.168.1.100:4113/api/health
   ```

### From Mobile Device:

1. Connect to the same WiFi network
2. Open browser on mobile
3. Go to: `http://192.168.1.100:4113/api`
4. You should see the API welcome message

## Troubleshooting

### Can't Access from Other Devices?

1. **Check Firewall:**
   ```bash
   # Ubuntu/Debian
   sudo ufw allow 4113/tcp
   
   # Fedora/CentOS
   sudo firewall-cmd --add-port=4113/tcp --permanent
   sudo firewall-cmd --reload
   ```

2. **Verify Server is Running:**
   ```bash
   netstat -tuln | grep 4113
   # Should show: 0.0.0.0:4113 (not 127.0.0.1:4113)
   ```

3. **Check Network Connection:**
   - Both devices must be on the same network
   - Check router doesn't have client isolation enabled

4. **Test Connection:**
   ```bash
   # From another device
   ping 192.168.1.100
   telnet 192.168.1.100 4113
   ```

### CORS Errors?

Make sure the frontend is configured to use the network IP:
```env
NEXT_PUBLIC_API_URL=http://192.168.1.100:4113/api
```

### Different Port Showing?

The default port is **4113** (as configured in server.js).
If you see port 5000, check your PORT environment variable.

## Security Notes

### Development Mode ⚠️
Current configuration uses `origin: '*'` which allows ALL origins.
This is **perfect for development** but **not secure for production**.

### Production Mode 🔒
For production, update CORS to specific origins:

```javascript
app.use(cors({
  origin: [
    'http://yourdomain.com',
    'https://yourdomain.com'
  ],
  credentials: true
}));
```

## Mobile Testing Setup

### Using Your Phone to Test:

1. **Connect phone to same WiFi as your computer**

2. **Update frontend on your computer:**
   ```env
   NEXT_PUBLIC_API_URL=http://192.168.1.100:4113/api
   ```

3. **Start Next.js frontend:**
   ```bash
   npm run dev -- -H 0.0.0.0
   ```

4. **Access from phone:**
   ```
   Frontend: http://192.168.1.100:3000
   Backend: http://192.168.1.100:4113/api
   ```

## Network Deployment Options

### Option 1: Local Development
- Backend: `http://localhost:4113`
- Frontend: `http://localhost:3000`
- Access: Same machine only

### Option 2: Network Testing
- Backend: `http://192.168.1.100:4113`
- Frontend: `http://192.168.1.100:3000`
- Access: All devices on same network

### Option 3: Production
- Backend: `https://api.yourdomain.com`
- Frontend: `https://yourdomain.com`
- Access: Public internet

## Quick Commands

### Find Your IP Address:
```bash
# Linux/Mac
ip addr show | grep "inet "
ifconfig | grep "inet "
hostname -I

# Windows
ipconfig
```

### Test Backend:
```bash
# From same machine
curl http://localhost:4113/api

# From network
curl http://192.168.1.100:4113/api
```

### Allow Port in Firewall:
```bash
# Ubuntu
sudo ufw allow 4113

# Fedora
sudo firewall-cmd --add-port=4113/tcp --permanent
sudo firewall-cmd --reload
```

## Summary

✅ **Server listens on:** `0.0.0.0:4113` (all interfaces)
✅ **CORS allows:** All origins (`*`)
✅ **Socket.IO allows:** Network connections
✅ **Displays:** Network IPs on startup
✅ **Accessible:** From any device on same network

Now you can access your backend API from:
- Your laptop
- Your phone
- Any other device on the same WiFi/network

Perfect for testing the mobile app or accessing from multiple devices! 📱💻🌐
