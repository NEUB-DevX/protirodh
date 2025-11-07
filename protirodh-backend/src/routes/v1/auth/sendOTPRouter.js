import express from 'express';
import { handleSendEmail } from '../../../controllers/auth/sendOTP.js';

const router = express.Router();

router
    .route('/auth/send-otp')
        .post(handleSendEmail)

export default router;