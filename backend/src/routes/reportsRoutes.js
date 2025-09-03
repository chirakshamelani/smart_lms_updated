import express from 'express';
import { db } from '../database/db.js';
import { protect } from '../middlewares/auth.js';
import { getSystemStats, getUserStats, getCourseStats, getEnrollmentStats } from '../controllers/reportsController.js';

const router = express.Router();

// Protect all routes with authentication middleware
router.use(protect);

// Report routes
router.get('/system', getSystemStats);
router.get('/users', getUserStats);
router.get('/courses', getCourseStats);
router.get('/enrollments', getEnrollmentStats);

export default router;