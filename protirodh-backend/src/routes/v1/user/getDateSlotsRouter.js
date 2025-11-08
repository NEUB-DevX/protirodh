import express from 'express';
import { handleGetDateSlots } from '../../../controllers/user/getDateSlots.js';

const router = express.Router();

// Public endpoint to get available date slots for a center
router.post('/get-all-dates', handleGetDateSlots);

export default router;
