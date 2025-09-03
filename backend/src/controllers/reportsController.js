import { db } from '../database/db.js';
import { getTimeframeFilter } from '../utils/timeframe.js';

export const getSystemStats = async (req, res) => {
  try {
    const timeframe = req.query.timeframe || 'month';
    const timeframeFilter = getTimeframeFilter(timeframe);

    const [totalUsers] = await db('users').count('* as count');
    const [totalCourses] = await db('courses').count('* as count');
    const [totalEnrollments] = await db('enrollments').count('* as count');
    const [activeUsers] = await db('users')
      .where('is_active', 1)
      .andWhere('updated_at', '>=', timeframeFilter.startDate)
      .count('* as count');
    const [averageCourseRating] = await db('grades')
      .avg('percentage as avg')
      .where('type', 'exam')
      .andWhere('created_at', '>=', timeframeFilter.startDate);

    res.json({
      totalUsers: Number(totalUsers.count) || 0,
      totalCourses: Number(totalCourses.count) || 0,
      totalEnrollments: Number(totalEnrollments.count) || 0,
      activeUsers: Number(activeUsers.count) || 0,
      averageCourseRating: parseFloat(Number(averageCourseRating.avg).toFixed(1)) || 0,
      systemUptime: 99.8, // Placeholder for system uptime
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const timeframe = req.query.timeframe || 'month';
    const timeframeFilter = getTimeframeFilter(timeframe);

    const [totalStudents] = await db('users').where('role', 'student').count('* as count');
    const [totalTeachers] = await db('users').where('role', 'teacher').count('* as count');
    const [totalAdmins] = await db('users').where('role', 'admin').count('* as count');
    const [newUsersThisMonth] = await db('users')
      .where('created_at', '>=', timeframeFilter.startDate)
      .count('* as count');
    const [activeUsersThisWeek] = await db('users')
      .where('is_active', 1)
      .andWhere('updated_at', '>=', timeframeFilter.startDate)
      .count('* as count');

    const totalUsers = (Number(totalStudents.count) || 0) +
                       (Number(totalTeachers.count) || 0) +
                       (Number(totalAdmins.count) || 0);

    res.json({
      totalStudents: Number(totalStudents.count) || 0,
      totalTeachers: Number(totalTeachers.count) || 0,
      totalAdmins: Number(totalAdmins.count) || 0,
      newUsersThisMonth: Number(newUsersThisMonth.count) || 0,
      activeUsersThisWeek: Number(activeUsersThisWeek.count) || 0,
      totalUsers,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
};

export const getCourseStats = async (req, res) => {
  try {
    const timeframe = req.query.timeframe || 'month';
    const timeframeFilter = getTimeframeFilter(timeframe);

    const [totalCourses] = await db('courses').count('* as count');
    const [activeCourses] = await db('courses')
      .where('status', 'published')
      .andWhere('start_date', '>=', timeframeFilter.startDate)
      .count('* as count');
    const [completedCourses] = await db('courses')
      .where('status', 'archived')
      .andWhere('end_date', '>=', timeframeFilter.startDate)
      .count('* as count');
    const enrollmentData = await db('enrollments')
      .count('* as count')
      .groupBy('course_id');
    const [topRatedCourses] = await db('grades')
      .where('percentage', '>=', 90)
      .andWhere('created_at', '>=', timeframeFilter.startDate)
      .countDistinct('course_id as count');

    const averageEnrollment = enrollmentData.length
      ? enrollmentData.reduce((sum, curr) => sum + Number(curr.count), 0) / enrollmentData.length
      : 0;

    res.json({
      totalCourses: Number(totalCourses.count) || 0,
      activeCourses: Number(activeCourses.count) || 0,
      completedCourses: Number(completedCourses.count) || 0,
      averageEnrollment: parseFloat(averageEnrollment.toFixed(1)) || 0,
      topRatedCourses: Number(topRatedCourses.count) || 0,
    });
  } catch (error) {
    console.error('Error fetching course stats:', error);
    res.status(500).json({ error: 'Failed to fetch course stats' });
  }
};

export const getEnrollmentStats = async (req, res) => {
  try {
    const timeframe = req.query.timeframe || 'month';
    const timeframeFilter = getTimeframeFilter(timeframe);

    const [totalEnrollments] = await db('enrollments').count('* as count');
    const [activeEnrollments] = await db('enrollments')
      .where('status', 'active')
      .andWhere('enrollment_date', '>=', timeframeFilter.startDate)
      .count('* as count');
    const [completedEnrollments] = await db('enrollments')
      .where('status', 'completed')
      .andWhere('enrollment_date', '>=', timeframeFilter.startDate)
      .count('* as count');
    const [totalInTimeframe] = await db('enrollments')
      .where('enrollment_date', '>=', timeframeFilter.startDate)
      .count('* as count');
    const [prevPeriodEnrollments] = await db('enrollments')
      .where('enrollment_date', '>=', timeframeFilter.prevStartDate)
      .andWhere('enrollment_date', '<', timeframeFilter.startDate)
      .count('* as count');

    const averageCompletionRate = Number(totalInTimeframe.count)
      ? (Number(completedEnrollments.count) / Number(totalInTimeframe.count) * 100).toFixed(1)
      : '0';
    const monthlyGrowth = Number(totalEnrollments.count) && Number(prevPeriodEnrollments.count)
      ? ((Number(totalEnrollments.count) - Number(prevPeriodEnrollments.count)) / Number(prevPeriodEnrollments.count) * 100).toFixed(1)
      : '0';

    res.json({
      totalEnrollments: Number(totalEnrollments.count) || 0,
      activeEnrollments: Number(activeEnrollments.count) || 0,
      completedEnrollments: Number(completedEnrollments.count) || 0,
      averageCompletionRate: parseFloat(averageCompletionRate) || 0,
      monthlyGrowth: parseFloat(monthlyGrowth) || 0,
    });
  } catch (error) {
    console.error('Error fetching enrollment stats:', error);
    res.status(500).json({ error: 'Failed to fetch enrollment stats' });
  }
};