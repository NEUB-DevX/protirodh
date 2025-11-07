import express from 'express';
import { handleSendEmail } from '../../../controllers/email/sendEmail.js';
const router = express.Router();

router
    .route('/email')
    .post(handleSendEmail);
    

export default router;