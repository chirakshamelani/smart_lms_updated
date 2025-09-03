import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, analyticsAPI } from '../../services/api';
import { Book, Calendar, Users, Award, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Course {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  instructor_first_name: string;
  instructor_last_name: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
  first_name: string;
  last_name: string;
  course_id: number;
}

interface CourseAnalytics {
  courseId: string;
  courseName: string;
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  averageGrade: number;
  completionRate: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  averageTimeSpent: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch courses
        let coursesData;
        if (user?.role === 'student') {
          coursesData = await courseAPI.getEnrolledCourses();
        } else {
          coursesData = await courseAPI.getCourses();
        }
        setCourses(coursesData.data.slice(0, 4));

        // Fetch analytics data
        const analyticsData = await analyticsAPI.getCourseAnalytics({ timeframe: 'month' });
        setCourseAnalytics(analyticsData);

        // Fetch announcements for enrolled courses
        const announcementsPromises = coursesData.data.slice(0, 4).map(async (course: Course) => {
          try {
            const response = await courseAPI.getAnnouncements(course.id);
            return response.data;
          } catch (err) {
            console.error(`Error fetching announcements for course ${course.id}:`, err);
            return [];
          }
        });

        const announcementsArrays = await Promise.all(announcementsPromises);
        const flattenedAnnouncements = announcementsArrays.flat().slice(0, 3);
        setAnnouncements(flattenedAnnouncements);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        if (err === 'Session expired. Please log in again.') {
          setError('Your session has expired. Please log in again.');
        } else if (err.response?.status === 401) {
          setError('Unauthorized access. Please log in.');
        } else if (err.response?.status === 404) {
          setError('No courses found.');
        } else {
          setError('Failed to load dashboard data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    } else {
      setError('Please log in to view your dashboard.');
      setIsLoading(false);
    }
  }, [user]);

  // Pie chart data: Course completion breakdown
  const pieData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [
          courseAnalytics.reduce((sum, course) => sum + (course.completionRate || 0), 0) / (courseAnalytics.length || 1),
          courseAnalytics.reduce((sum, course) => sum + (course.averageProgress || 0), 0) / (courseAnalytics.length || 1),
          courseAnalytics.length
            ? 100 - (courseAnalytics.reduce((sum, course) => sum + (course.averageProgress || 0), 0) / courseAnalytics.length)
            : 0,
        ],
        backgroundColor: ['#22C55E', '#3B82F6', '#F59E0B'],
        borderWidth: 0,
      },
    ],
  };

  // Bar chart data: Average grades per course
  const barData = {
    labels: courseAnalytics.map((course) => course.courseName),
    datasets: [
      {
        label: 'Average Grade',
        data: courseAnalytics.map((course) => Number(course.averageGrade) || 0),
        backgroundColor: '#8B5CF6',
        borderColor: '#7C3AED',
        borderWidth: 1,
      },
      {
        label: 'Average Progress',
        data: courseAnalytics.map((course) => Number(course.averageProgress) || 0),
        backgroundColor: '#14B8A6',
        borderColor: '#0D9488',
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuad',
      loop: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#1F2937',
        },
      },
      title: {
        display: true,
        text: user?.role === 'student' ? 'Your Performance' : 'Course Performance',
        color: '#1F2937',
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#1F2937',
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#1F2937',
          stepSize: 20,
        },
        grid: {
          color: '#E5E7EB',
        },
      },
    },
  };

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 fade-in">
      <h1 className="h3 mb-4">Welcome, {user?.first_name}!</h1>

      <div className="row g-4">
        {/* Stats Cards */}
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex">
              <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                <Book className="text-primary" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">My Courses</h6>
                <h4 className="mb-0">{courses.length}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex">
              <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                <Award className="text-success" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Achievements</h6>
                <h4 className="mb-0">{courseAnalytics.reduce((sum, course) => sum + (course.completionRate > 90 ? 1 : 0), 0)}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex">
              <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                <Calendar className="text-warning" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Upcoming</h6>
                <h4 className="mb-0">{announcements.length}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-8">
          {/* Recent Courses */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">My Courses</h5>
              <Link to="/courses" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <div key={course.id} className="col-md-6">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="ratio ratio-16x9">
                          <img
                            src={course.cover_image || 'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                            className="card-img-top"
                            alt={course.title}
                          />
                        </div>
                        <div className="card-body">
                          <h5 className="card-title">{course.title}</h5>
                          <p className="card-text text-muted small">
                            {course.description.length > 100
                              ? `${course.description.substring(0, 100)}...`
                              : course.description}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {course.instructor_first_name} {course.instructor_last_name}
                            </small>
                            <Link to={`/courses/${course.id}`} className="btn btn-sm btn-primary">
                              View Course
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-4">
                    <p className="text-muted mb-2">You are not enrolled in any courses yet.</p>
                    <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Analytics for Teachers/Admin or Progress for Students */}
          {user?.role !== 'student' ? (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <h5 className="mb-0">Course Analytics</h5>
                <Link to="/analytics" className="btn btn-sm btn-outline-primary">View Detailed Analytics</Link>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="d-flex flex-column align-items-center">
                      <h6 className="text-center mb-3">Course Completion</h6>
                      <div style={{ height: '180px', width: '180px' }}>
                        <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <h6 className="text-center mb-3">Course Performance</h6>
                    <div style={{ height: '200px', position: 'relative' }}>
                      <Bar data={barData} options={barOptions} height={200} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <h5 className="mb-0">My Progress</h5>
                <Link to="/analytics" className="btn btn-sm btn-outline-primary">View Detailed Analytics</Link>
              </div>
              <div className="card-body">
                {courseAnalytics.map((course) => (
                  <div key={course.courseId} className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span>{course.courseName}</span>
                      <span>{Math.round(course.averageProgress)}%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: `${course.averageProgress}%` }}
                        aria-valuenow={course.averageProgress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                ))}
                {courseAnalytics.length === 0 && (
                  <div className="text-center text-muted">No progress data available.</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          {/* Calendar Section */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">Upcoming Events</h5>
              <Link to="/calendar" className="btn btn-sm btn-outline-primary">View Calendar</Link>
            </div>
            <div className="card-body">
              <div className="d-flex mb-3 pb-3 border-bottom">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <Calendar className="text-primary" size={20} />
                </div>
                <div>
                  <h6 className="mb-1">Quiz: JavaScript Basics</h6>
                  <p className="text-muted small mb-0">Tomorrow, 10:00 AM</p>
                </div>
              </div>
              <div className="d-flex mb-3 pb-3 border-bottom">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                  <Award className="text-success" size={20} />
                </div>
                <div>
                  <h6 className="mb-1">Assignment Due: HTML Project</h6>
                  <p className="text-muted small mb-0">Friday, 11:59 PM</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                  <Users className="text-info" size={20} />
                </div>
                <div>
                  <h6 className="mb-1">Group Discussion: CSS Layouts</h6>
                  <p className="text-muted small mb-0">Saturday, 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Announcements Section */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Announcements</h5>
            </div>
            <div className="card-body p-0">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div key={announcement.id} className="p-3 border-bottom">
                    <h6 className="mb-1">{announcement.title}</h6>
                    <p className="text-muted small mb-2">
                      {new Date(announcement.created_at).toLocaleDateString()} • {announcement.first_name}{' '}
                      {announcement.last_name}
                    </p>
                    <p className="small mb-0">
                      {announcement.content.length > 100
                        ? `${announcement.content.substring(0, 100)}...`
                        : announcement.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-muted">
                  No announcements available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;