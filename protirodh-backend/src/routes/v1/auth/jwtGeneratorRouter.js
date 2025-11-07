import express from 'express';
import { handleGenerateJWTToken } from '../../../controllers/auth/jwtGenerator.js';

const router = express.Router();

router
    .route('/auth')
        .post(handleGenerateJWTToken)

export default router;