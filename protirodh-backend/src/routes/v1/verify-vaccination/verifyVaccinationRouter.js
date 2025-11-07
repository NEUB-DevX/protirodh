import express from 'express';
import { handleVerifyVaccination } from '../../../controllers/verify-vaccination/verify-vaccination.js';
const router = express.Router();

router.get("/verify/:type/:nid", handleVerifyVaccination);

export default router;