import express from 'express';
import { placeEnrollment, getEnrollments, getOneEnrollment, getEnrollmentCountsHandler } from '../controllers/enrollment.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = express.Router();

// Public: place enrollment
router.post('/', placeEnrollment);

// Admin protected: list and get
router.get('/', requireAuth, getEnrollments);
router.get('/counts', requireAuth, getEnrollmentCountsHandler);
router.get('/:id', requireAuth, getOneEnrollment);

export default router;
