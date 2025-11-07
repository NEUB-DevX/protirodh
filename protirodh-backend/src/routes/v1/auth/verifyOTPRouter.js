import express from 'express';
import { handleVerifyCode } from '../../../controllers/auth/verifyOTP.js';

const router = express.Router();

router
    .route('/auth/verify-otp')
        .post(handleVerifyCode)

export default router;