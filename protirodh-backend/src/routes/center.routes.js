import express from 'express';
import * as centerOperations from '../controllers/center/centerOperations.js';
import { authenticateCenterToken } from '../middlewares/centerAuthMiddleware.js';

const router = express.Router();

// All center routes require center authentication
router.use(authenticateCenterToken);

// Stock request routes
router.get('/stock-requests', centerOperations.getCenterStockRequests);
router.post('/stock-requests', centerOperations.createStockRequest);
router.get('/stock-requests/:id', centerOperations.getStockRequestById);

// Vaccine lookup routes
router.get('/vaccines', centerOperations.getAvailableVaccines);
router.get('/vaccines/:id', centerOperations.getVaccineById);

// Center profile routes
router.get('/profile', centerOperations.getCenterProfile);
router.put('/profile', centerOperations.updateCenterProfile);

// Center dashboard/analytics
router.get('/dashboard', centerOperations.getCenterDashboard);

export default router;