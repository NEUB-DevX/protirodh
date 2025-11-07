import express from 'express';
import { handleOnBoardUser } from '../../../controllers/user/onboardUser.js';
const router = express.Router();

router.post('/user/onboard', handleOnBoardUser);

export default router;