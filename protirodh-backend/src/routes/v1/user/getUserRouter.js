import express from 'express';
import { handleGetUser } from '../../../controllers/user/getUser.js';
const router = express.Router();

router.post('/user/get-user', handleGetUser);

export default router;