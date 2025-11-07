import express from 'express';
import * as centerOperations from '../controllers/center/centerOperations.js';
import * as staffManagement from '../controllers/center/staffManagement.js';
import * as scheduleManagement from '../controllers/center/scheduleManagement.js';
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

// Staff management routes
router.get('/staff', staffManagement.getCenterStaff);
router.post('/staff', staffManagement.createStaff);
router.put('/staff/:id', staffManagement.updateStaff);
router.delete('/staff/:id', staffManagement.deleteStaff);

// Date slot routes
router.get('/date-slots', scheduleManagement.getDateSlots);
router.post('/date-slots', scheduleManagement.createDateSlot);
router.put('/date-slots/:id', scheduleManagement.updateDateSlot);
router.delete('/date-slots/:id', scheduleManagement.deleteDateSlot);

// Time slot routes
router.get('/date-slots/:dateSlotId/time-slots', scheduleManagement.getTimeSlots);
router.post('/time-slots', scheduleManagement.createTimeSlot);
router.put('/time-slots/:id', scheduleManagement.updateTimeSlot);
router.delete('/time-slots/:id', scheduleManagement.deleteTimeSlot);

export default router;