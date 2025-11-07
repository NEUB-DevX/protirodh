import express from 'express';
import { handleAiRes } from '../../../controllers/ai/aiRes.js';

const router = express.Router();

router
    .route('/ai')
        .post(handleAiRes)

export default router;