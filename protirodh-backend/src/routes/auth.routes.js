import express from 'express';
import * as centerAuth from '../controllers/auth/centerAuth.js';

const router = express.Router();

// Center authentication routes
router.post('/center/login', centerAuth.centerLogin);
router.post('/center/verify-token', centerAuth.verifyCenterToken);
router.post('/center/logout', centerAuth.centerLogout);

export default router;