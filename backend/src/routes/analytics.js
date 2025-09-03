// src/routes/analytics.js
import express from 'express';
import { getCourseAnalytics, getStudentPerformance, getAssignmentAnalytics, getAIPredictions } from '../controllers/AnalyticsController.js';
import { protect } from '../middlewares/auth.js'; // Assuming you have an auth middleware

const router = express.Router();

// Protect all routes with authentication middleware
router.use(protect);

// Analytics routes
router.get('/courses', getCourseAnalytics);
router.get('/students', getStudentPerformance);
router.get('/assignments', getAssignmentAnalytics);
router.get('/ai-predictions', getAIPredictions);

export default router;