import express from 'express';
import { handleCreateUserNoPassword } from '../../../controllers/user/createUser-no-password.js';
const router = express.Router();

router
    .route('/user/register')
    .post(handleCreateUserNoPassword)
    

export default router;