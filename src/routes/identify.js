import { Router } from 'express';
import { validateIdentifyRequest } from '../middleware/validation.js';
import { identifyContact } from '../controllers/contactController.js';

const router = Router();

router.post('/', validateIdentifyRequest, identifyContact);

export { router as identifyRouter };