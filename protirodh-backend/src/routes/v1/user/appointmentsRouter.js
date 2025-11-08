import express from 'express';
import { handleCreateAppointment, handleGetUserAppointments } from '../../../controllers/user/createAppointment.js';

const router = express.Router();

// Public endpoints for user appointments
router.post('/appointments', handleCreateAppointment);
router.post('/appointments/user', handleGetUserAppointments);

export default router;
