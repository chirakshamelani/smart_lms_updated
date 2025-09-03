import express from 'express';
import {
  getAllCourses,
  getPublishedCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
  createLesson,
  updateLesson,
  deleteLesson,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  unenrollStudent,
  getStudentProgress,
  getLessons,
  getStudent
} from '../controllers/courseController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Course routes
router.get('/', protect, getAllCourses);
router.get('/published', protect, getPublishedCourses);
router.get('/:id', protect, getCourse);
router.post('/', protect, authorize('teacher', 'admin'), createCourse);
router.put('/:id', protect, authorize('teacher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteCourse);
router.post('/:id/enroll', protect, authorize('student'), enrollCourse);
router.delete('/:id/enroll/:userId', protect, authorize('teacher', 'admin'), unenrollStudent);
router.get('/enrolled/me', protect, getEnrolledCourses);

// Lesson routes
router.post('/:courseId/lessons', protect, authorize('teacher', 'admin'), createLesson);
router.put('/:courseId/lessons/:lessonId', protect, authorize('teacher', 'admin'), updateLesson);
router.delete('/:courseId/lessons/:lessonId', protect, authorize('teacher', 'admin'), deleteLesson);

// Quiz routes
router.post('/:courseId/quizzes', protect, authorize('teacher', 'admin'), createQuiz);
router.put('/:courseId/quizzes/:quizId', protect, authorize('teacher', 'admin'), updateQuiz);
router.delete('/:courseId/quizzes/:quizId', protect, authorize('teacher', 'admin'), deleteQuiz);

// Announcement routes
router.get('/:courseId/announcements', protect, getAnnouncements);
router.post('/:courseId/announcements', protect, authorize('teacher', 'admin'), createAnnouncement);
router.put('/:courseId/announcements/:announcementId', protect, authorize('teacher', 'admin'), updateAnnouncement);
router.delete('/:courseId/announcements/:announcementId', protect, authorize('teacher', 'admin'), deleteAnnouncement);

// Assignment routes
router.post('/:courseId/assignments', protect, authorize('teacher', 'admin'), createAssignment);
router.put('/:courseId/assignments/:assignmentId', protect, authorize('teacher', 'admin'), updateAssignment);
router.delete('/:courseId/assignments/:assignmentId', protect, authorize('teacher', 'admin'), deleteAssignment);

router.route('/:courseId/lessons')
  .get(protect, getLessons);

router.route('/:courseId/students/:studentId/progress')
  .get(protect, getStudentProgress);

router.route('/:courseId/students/:studentId')
  .get(protect, getStudent);

export default router;