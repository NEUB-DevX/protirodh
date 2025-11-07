import express from 'express';
import * as hubManagement from '../controllers/admin/hubManagement.js';
import { authenticateAdminToken } from '../middlewares/centerAuthMiddleware.js';

const router = express.Router();

// All hub routes require admin authentication
router.use(authenticateAdminToken);

// Vaccine management routes
router.get('/vaccines', hubManagement.getAllVaccines);
router.post('/vaccines', hubManagement.createVaccine);
router.put('/vaccines/:id', hubManagement.updateVaccine);
router.delete('/vaccines/:id', hubManagement.deleteVaccine);
router.get('/vaccines/:id', hubManagement.getVaccineById);

// Center management routes
router.get('/centers', hubManagement.getAllCenters);
router.post('/centers', hubManagement.createCenter);
router.put('/centers/:id', hubManagement.updateCenter);
router.delete('/centers/:id', hubManagement.deleteCenter);
router.get('/centers/:id', hubManagement.getCenterById);

// Stock request management routes
router.get('/stock-requests', hubManagement.getAllStockRequests);
router.put('/stock-requests/:id/approve', hubManagement.approveStockRequest);
router.put('/stock-requests/:id/reject', hubManagement.rejectStockRequest);
router.get('/stock-requests/:id', hubManagement.getStockRequestById);

// Analytics routes
router.get('/analytics/dashboard', hubManagement.getDashboardAnalytics);

export default router;