import express from 'express';
import * as hubAuth from '../controllers/auth/hubAuth.js';
import * as centerAuth from '../controllers/auth/centerAuth.js';
import * as staffAuth from '../controllers/auth/staffAuth.js';

const router = express.Router();

// Hub admin authentication routes
router.post('/hub/login', hubAuth.hubLogin);
router.post('/hub/verify-token', hubAuth.verifyHubToken);
router.post('/hub/logout', hubAuth.hubLogout);

// Center authentication routes
router.post('/center/login', centerAuth.centerLogin);
router.post('/center/verify-token', centerAuth.verifyCenterToken);
router.post('/center/logout', centerAuth.centerLogout);

// Staff authentication routes
router.post('/staff/login', staffAuth.staffLogin);
router.post('/staff/verify-token', staffAuth.verifyStaffToken);
router.post('/staff/logout', staffAuth.staffLogout);

export default router;