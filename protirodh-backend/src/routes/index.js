import express from 'express';
import authRoutes from './auth.routes.js';
import hubRoutes from './hub.routes.js';
import centerRoutes from './center.routes.js';
import staffRoutes from './staff.routes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/hub', hubRoutes);
router.use('/center', centerRoutes);
router.use('/staff', staffRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

// Default route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Protirodh Vaccination Management API',
    version: '1.0.0',
    endpoints: {
      authentication: '/api/auth',
      hub_management: '/api/hub',
      center_operations: '/api/center',
      staff_operations: '/api/staff',
      health_check: '/api/health'
    }
  });
});

export default router;