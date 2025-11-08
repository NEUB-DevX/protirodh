import express from 'express';
import { handleAllInfo } from '../../../controllers/admin/allInfo.js';
const router = express.Router();

router
    .route('/all-info')
    .post(handleAllInfo);
    

export default router;