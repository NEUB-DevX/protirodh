import express from 'express';
import * as staffOperations from '../controllers/staff/staffOperations.js';
import { authenticateStaffToken } from '../middlewares/staffAuthMiddleware.js';

const router = express.Router();

// All staff routes require staff authentication
router.use(authenticateStaffToken);

// Staff profile routes
router.get('/profile', staffOperations.getStaffProfile);

// Staff dashboard
router.get('/dashboard', staffOperations.getStaffDashboard);

// Appointment routes
router.get('/appointments', staffOperations.getStaffAppointments);
router.get('/appointments/:id', staffOperations.getAppointmentById);
router.put('/appointments/:id/complete', staffOperations.completeAppointment);
router.put('/appointments/:id/no-show', staffOperations.markAsNoShow);
router.put('/appointments/:id/notes', staffOperations.updateAppointmentNotes);

export default router;
