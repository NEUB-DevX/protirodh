import express from 'express';
import { handleVerifyVaccination } from '../../../controllers/verify-vaccination/verify-vaccination.js';
const router = express.Router();

router.get("/verify/:nid/:vaccName", handleVerifyVaccination);

export default router;