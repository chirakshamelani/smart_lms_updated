import { db } from '../database/db.js';

export const getCourseAnalytics = async (req, res, next) => {
  try {
    const { courseId, timeframe } = req.query;

    let query = db('courses')
      .select(
        'courses.id as courseId',
        'courses.title as courseName',
        db.raw('(SELECT COUNT(DISTINCT grades.user_id) FROM grades WHERE grades.course_id = courses.id) as totalStudents'),
        db.raw('(SELECT COUNT(DISTINCT grades.user_id) FROM grades WHERE grades.course_id = courses.id AND grades.updated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)) as activeStudents'),
        // Updated averageGrade to ensure numeric output
        db.raw('COALESCE((SELECT AVG(COALESCE(percentage, 0)) FROM grades WHERE grades.course_id = courses.id), 0) as averageGrade'),
        // Simplified averageProgress subquery
        db.raw(`
          COALESCE((
            SELECT AVG(
              COALESCE((
                SELECT COUNT(up.id) * 100.0 / NULLIF((SELECT COUNT(*) FROM lessons l WHERE l.course_id = courses.id), 0)
                FROM user_progress up
                WHERE up.user_id = grades.user_id
                AND up.completed = true
                AND up.lesson_id IN (SELECT id FROM lessons WHERE course_id = courses.id)
              ), 0)
            )
            FROM grades
            WHERE grades.course_id = courses.id
          ), 0) as averageProgress
        `),
        db.raw('COALESCE((SELECT COUNT(DISTINCT user_id) / NULLIF((SELECT COUNT(DISTINCT grades.user_id) FROM grades WHERE grades.course_id = courses.id), 0) * 100 FROM user_progress WHERE completed = true GROUP BY user_id HAVING COUNT(*) = (SELECT COUNT(*) FROM lessons WHERE course_id = courses.id)), 0) as completionRate'),
        db.raw('(SELECT COUNT(*) FROM assignment_submissions sub JOIN assignments a ON sub.assignment_id = a.id WHERE a.course_id = courses.id) as assignmentsSubmitted'),
        db.raw('(SELECT COUNT(*) FROM assignments WHERE course_id = courses.id) as totalAssignments'),
        db.raw('COALESCE((SELECT AVG(TIMESTAMPDIFF(HOUR, a.created_at, sub.submitted_at)) FROM assignment_submissions sub JOIN assignments a ON sub.assignment_id = a.id WHERE a.course_id = courses.id), 0) as averageTimeSpent')
      )
      .leftJoin('assignments', 'courses.id', 'assignments.course_id')
      .leftJoin('assignment_submissions', 'assignments.id', 'assignment_submissions.assignment_id')
      .groupBy('courses.id');

    if (courseId) {
      query = query.where('courses.id', courseId);
    }

    if (timeframe) {
      let dateFilter;
      if (timeframe === 'week') dateFilter = 'DATE_SUB(NOW(), INTERVAL 1 WEEK)';
      else if (timeframe === 'month') dateFilter = 'DATE_SUB(NOW(), INTERVAL 1 MONTH)';
      else if (timeframe === 'semester') dateFilter = 'DATE_SUB(NOW(), INTERVAL 6 MONTH)';
      if (dateFilter) {
        query = query.where('courses.created_at', '>=', db.raw(dateFilter));
      }
    }

    const analytics = await query;
    res.status(200).json(analytics);
  } catch (error) {
    console.error('Error fetching course analytics:', error);
    next(error);
  }
};

export const getStudentPerformance = async (req, res, next) => {
  try {
    const { courseId, timeframe } = req.query;

    let query = db('users')
      .join('grades', 'users.id', 'grades.user_id')
      .join('courses', 'grades.course_id', 'courses.id')
      .select(
        'users.id as studentId',
        db.raw("CONCAT(users.first_name, ' ', users.last_name) as studentName"),
        'courses.title as courseName',
        db.raw('COALESCE((SELECT AVG(percentage) FROM grades g WHERE g.user_id = users.id AND g.course_id = grades.course_id), 0) as grade'),
        db.raw('COALESCE((SELECT (COUNT(up.id) / NULLIF((SELECT COUNT(*) FROM lessons l WHERE l.course_id = grades.course_id), 0) * 100) FROM user_progress up JOIN lessons l ON up.lesson_id = l.id WHERE up.user_id = users.id AND up.completed = true AND l.course_id = grades.course_id), 0) as progress'),
        db.raw('(SELECT COUNT(*) FROM assignment_submissions sub JOIN assignments a ON sub.assignment_id = a.id WHERE sub.user_id = users.id AND a.course_id = grades.course_id) as assignmentsCompleted'),
        // Updated timeSpent subquery
        db.raw('COALESCE((SELECT AVG(TIMESTAMPDIFF(HOUR, a.created_at, sub.submitted_at)) FROM assignment_submissions sub JOIN assignments a ON sub.assignment_id = a.id WHERE sub.user_id = users.id AND a.course_id = grades.course_id), 0) as timeSpent'),
        db.raw('MAX(grades.updated_at) as lastActivity')
      )
      .where('users.role', 'student')
      .groupBy('users.id', 'grades.course_id');

    if (courseId) {
      query = query.where('grades.course_id', courseId);
    }

    if (timeframe) {
      let dateFilter;
      if (timeframe === 'week') dateFilter = 'DATE_SUB(NOW(), INTERVAL 1 WEEK)';
      else if (timeframe === 'month') dateFilter = 'DATE_SUB(NOW(), INTERVAL 1 MONTH)';
      else if (timeframe === 'semester') dateFilter = 'DATE_SUB(NOW(), INTERVAL 6 MONTH)';
      if (dateFilter) {
        query = query.where('grades.updated_at', '>=', db.raw(dateFilter));
      }
    }

    const performance = await query;
    res.status(200).json(performance);
  } catch (error) {
    console.error('Error fetching student performance:', error);
    next(error);
  }
};

export const getAssignmentAnalytics = async (req, res, next) => {
  try {
    const { courseId, timeframe } = req.query;

    let query = db('assignments')
      .select(
        'assignments.id as assignmentId',
        'assignments.title as assignmentName',
        'courses.title as courseName',
        db.raw('(SELECT COUNT(DISTINCT grades.user_id) FROM grades WHERE grades.course_id = assignments.course_id) as totalStudents'),
        db.raw('(SELECT COUNT(*) FROM assignment_submissions WHERE assignment_id = assignments.id) as submittedCount'),
        db.raw('COALESCE(AVG(assignment_submissions.grade), 0) as averageScore'),
        db.raw('COALESCE((COUNT(assignment_submissions.id) / NULLIF((SELECT COUNT(DISTINCT grades.user_id) FROM grades WHERE grades.course_id = assignments.course_id), 0) * 100), 0) as submissionRate'),
        db.raw('COALESCE(AVG(TIMESTAMPDIFF(HOUR, assignments.created_at, assignment_submissions.submitted_at)), 0) as averageTimeSpent')
      )
      .join('courses', 'assignments.course_id', 'courses.id')
      .leftJoin('assignment_submissions', 'assignments.id', 'assignment_submissions.assignment_id')
      .groupBy('assignments.id');

    if (courseId) {
      query = query.where('assignments.course_id', courseId);
    }

    if (timeframe) {
      let dateFilter;
      if (timeframe === 'week') dateFilter = 'DATE_SUB(NOW(), INTERVAL 1 WEEK)';
      else if (timeframe === 'month') dateFilter = 'DATE_SUB(NOW(), INTERVAL 1 MONTH)';
      else if (timeframe === 'semester') dateFilter = 'DATE_SUB(NOW(), INTERVAL 6 MONTH)';
      if (dateFilter) {
        query = query.where('assignments.created_at', '>=', db.raw(dateFilter));
      }
    }

    const analytics = await query;
    res.status(200).json(analytics);
  } catch (error) {
    console.error('Error fetching assignment analytics:', error);
    next(error);
  }
};

export const getAIPredictions = async (req, res, next) => {
  try {
    const { courseId, userId } = req.query;

    let query = db('ai_predictions')
      .select(
        'ai_predictions.id',
        'ai_predictions.user_id as userId',
        'ai_predictions.course_id as courseId',
        db.raw("CONCAT(users.first_name, ' ', users.last_name) as studentName"),
        'courses.title as courseName',
        'ai_predictions.predicted_grade as predictedGrade',
        'ai_predictions.confidence_score as confidenceScore',
        'ai_predictions.performance_level as performanceLevel',
        'ai_predictions.prediction_factors as predictionFactors',
        'ai_predictions.prediction_date as predictionDate'
      )
      .join('users', 'ai_predictions.user_id', 'users.id')
      .join('courses', 'ai_predictions.course_id', 'courses.id');

    if (courseId) {
      query = query.where('ai_predictions.course_id', courseId);
    }
    if (userId) {
      query = query.where('ai_predictions.user_id', userId);
    }

    const predictions = await query;
    res.status(200).json(predictions);
  } catch (error) {
    console.error('Error fetching AI predictions:', error);
    next(error);
  }
};