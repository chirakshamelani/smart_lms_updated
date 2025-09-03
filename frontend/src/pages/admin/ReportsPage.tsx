import React, { useState, useEffect } from 'react';
import { PieChart, BarChart3, TrendingUp, Users, BookOpen, Award, Clock, Download, Filter, Calendar } from 'lucide-react';
import { reportsAPI } from '../../services/api'; // Import the analytics API
import * as XLSX from 'xlsx'; // Import SheetJS for Excel export

interface SystemStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  activeUsers: number;
  averageCourseRating: number;
  systemUptime: number;
}

interface UserStats {
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  newUsersThisMonth: number;
  activeUsersThisWeek: number;
}

interface CourseStats {
  totalCourses: number;
  activeCourses: number;
  completedCourses: number;
  averageEnrollment: number;
  topRatedCourses: number;
}

interface EnrollmentStats {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageCompletionRate: number;
  monthlyGrowth: number;
}

const ReportsPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedReport, setSelectedReport] = useState<string>('overview');
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [courseStats, setCourseStats] = useState<CourseStats | null>(null);
  const [enrollmentStats, setEnrollmentStats] = useState<EnrollmentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data based on timeframe
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const systemData = await reportsAPI.getSystemStats({ timeframe: selectedTimeframe });
        setSystemStats(systemData);

        const userData = await reportsAPI.getUserStats({ timeframe: selectedTimeframe });
        setUserStats(userData);

        const courseData = await reportsAPI.getCourseStats({ timeframe: selectedTimeframe });
        setCourseStats(courseData);

        const enrollmentData = await reportsAPI.getEnrollmentStats({ timeframe: selectedTimeframe });
        setEnrollmentStats(enrollmentData);
      } catch (err) {
        setError('Failed to fetch report data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTimeframe]);

  // Function to export report as Excel
  const exportToExcel = () => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    let ws: XLSX.WorkSheet;
    let wsName: string;

    // Prepare data based on selected report
    switch (selectedReport) {
      case 'overview':
        wsName = 'System Overview';
        ws = XLSX.utils.json_to_sheet([
          {
            'Total Users': systemStats?.totalUsers.toLocaleString() || 'N/A',
            'Total Courses': systemStats?.totalCourses || 'N/A',
            'Total Enrollments': systemStats?.totalEnrollments.toLocaleString() || 'N/A',
            'System Uptime (%)': systemStats?.systemUptime || 'N/A',
            'Students (%)': userStats ? Math.round((userStats.totalStudents / (userStats.totalStudents + userStats.totalTeachers + userStats.totalAdmins)) * 100) : 'N/A',
            'Teachers (%)': userStats ? Math.round((userStats.totalTeachers / (userStats.totalStudents + userStats.totalTeachers + userStats.totalAdmins)) * 100) : 'N/A',
            'Admins (%)': userStats ? Math.round((userStats.totalAdmins / (userStats.totalStudents + userStats.totalTeachers + userStats.totalAdmins)) * 100) : 'N/A',
            'New Users This Month': userStats?.newUsersThisMonth || 'N/A',
            'Course Completions': enrollmentStats?.completedEnrollments || 'N/A',
          },
        ]);
        break;

      case 'users':
        wsName = 'User Analytics';
        ws = XLSX.utils.json_to_sheet([
          {
            'Total Students': userStats?.totalStudents.toLocaleString() || 'N/A',
            'Total Teachers': userStats?.totalTeachers.toLocaleString() || 'N/A',
            'Total Admins': userStats?.totalAdmins.toLocaleString() || 'N/A',
            'New Users This Month': userStats?.newUsersThisMonth || 'N/A',
            'Active Users This Week': userStats?.activeUsersThisWeek || 'N/A',
            'Weekly Active Rate (%)': userStats ? Math.round((userStats.activeUsersThisWeek / (userStats.totalStudents + userStats.totalTeachers + userStats.totalAdmins)) * 100) : 'N/A',
            'Highly Active (%)': 35,
            'Moderately Active (%)': 45,
            'Low Activity (%)': 20,
          },
        ]);
        break;

      case 'courses':
        wsName = 'Course Analytics';
        ws = XLSX.utils.json_to_sheet([
          {
            'Total Courses': courseStats?.totalCourses || 'N/A',
            'Active Courses': courseStats?.activeCourses || 'N/A',
            'Completed Courses': courseStats?.completedCourses || 'N/A',
            'Average Enrollment': courseStats?.averageEnrollment || 'N/A',
            'Computer Science (%)': 45,
            'Mathematics (%)': 25,
            'Business (%)': 20,
            'Other (%)': 10,
            'Beginner (%)': 40,
            'Intermediate (%)': 35,
            'Advanced (%)': 25,
          },
        ]);
        break;

      case 'enrollments':
        wsName = 'Enrollment Analytics';
        ws = XLSX.utils.json_to_sheet([
          {
            'Total Enrollments': enrollmentStats?.totalEnrollments.toLocaleString() || 'N/A',
            'Active Enrollments': enrollmentStats?.activeEnrollments.toLocaleString() || 'N/A',
            'Completed Enrollments': enrollmentStats?.completedEnrollments.toLocaleString() || 'N/A',
            'Average Completion Rate (%)': enrollmentStats?.averageCompletionRate || 'N/A',
            'Monthly Growth (%)': enrollmentStats?.monthlyGrowth || 'N/A',
          },
        ]);
        break;

      case 'performance':
        wsName = 'Performance Metrics';
        ws = XLSX.utils.json_to_sheet([
          {
            'System Uptime (%)': systemStats?.systemUptime || 'N/A',
            'Response Time (ms)': 120,
            'Error Rate (%)': 0.02,
            'Average Course Rating': systemStats?.averageCourseRating || 'N/A',
            'User Satisfaction': 4.7,
            'Support Response (hours)': 2.3,
          },
        ]);
        break;

      default:
        wsName = 'Report';
        ws = XLSX.utils.json_to_sheet([]);
    }

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, wsName);

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `Report_${selectedReport}_${selectedTimeframe}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const reports = [
    { id: 'overview', label: 'System Overview', icon: PieChart },
    { id: 'users', label: 'User Analytics', icon: Users },
    { id: 'courses', label: 'Course Analytics', icon: BookOpen },
    { id: 'enrollments', label: 'Enrollment Analytics', icon: TrendingUp },
    { id: 'performance', label: 'Performance Metrics', icon: Award },
  ];

  const renderOverviewReport = () => (
    <div className="d-flex flex-column gap-4">
      {/* Key Metrics */}
      <div className="row g-3">
        <div className="col-lg-3 card border-0 shadow-sm">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <p className="small text-muted mb-1">Total Users</p>
              <p className="h4 mb-0 text-primary">{systemStats?.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="text-primary" size={32} />
          </div>
          <div className="card-footer bg-transparent border-0">
            <span className="small text-success">+12%</span> from last period
          </div>
        </div>

        <div className="col-lg-3 card border-0 shadow-sm">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <p className="small text-muted mb-1">Total Courses</p>
              <p className="h4 mb-0 text-success">{systemStats?.totalCourses}</p>
            </div>
            <BookOpen className="text-success" size={32} />
          </div>
          <div className="card-footer bg-transparent border-0">
            <span className="small text-success">+8%</span> from last period
          </div>
        </div>

        <div className="col-lg-3 card border-0 shadow-sm">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <p className="small text-muted mb-1">Total Enrollments</p>
              <p className="h4 mb-0 text-purple">{systemStats?.totalEnrollments.toLocaleString()}</p>
            </div>
            <TrendingUp className="text-purple" size={32} />
          </div>
          <div className="card-footer bg-transparent border-0">
            <span className="small text-success">+15%</span> from last period
          </div>
        </div>

        <div className="col-lg-3 card border-0 shadow-sm">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>
              <p className="small text-muted mb-1">System Uptime</p>
              <p className="h4 mb-0 text-orange">{systemStats?.systemUptime}%</p>
            </div>
            <Clock className="text-orange" size={32} />
          </div>
          <div className="card-footer bg-transparent border-0">
            <span className="small text-success">+0.2%</span> from last period
          </div>
        </div>
      </div>

      {/* User Distribution Chart */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h3 className="h5 mb-3 text-dark">User Distribution</h3>
          <div className="row g-3">
            <div className="col-md-4 text-center">
              <div className="position-relative mx-auto mb-3" style={{ width: '128px', height: '128px' }}>
                <svg className="w-100 h-100" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                  <path
                    className="text-secondary"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${Math.round((userStats?.totalStudents || 0) / (userStats?.totalStudents + userStats?.totalTeachers + userStats?.totalAdmins || 1) * 100)}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="position-absolute top-50 start-50 translate-middle">
                  <span className="fs-4 fw-bold text-primary">{Math.round((userStats?.totalStudents || 0) / (userStats?.totalStudents + userStats?.totalTeachers + userStats?.totalAdmins || 1) * 100)}%</span>
                </div>
              </div>
              <h4 className="small text-dark">Students</h4>
              <p className="small text-muted">{userStats?.totalStudents.toLocaleString()} users</p>
            </div>

            <div className="col-md-4 text-center">
              <div className="position-relative mx-auto mb-3" style={{ width: '128px', height: '128px' }}>
                <svg className="w-100 h-100" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                  <path
                    className="text-secondary"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-success"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${Math.round((userStats?.totalTeachers || 0) / (userStats?.totalStudents + userStats?.totalTeachers + userStats?.totalAdmins || 1) * 100)}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="position-absolute top-50 start-50 translate-middle">
                  <span className="fs-4 fw-bold text-success">{Math.round((userStats?.totalTeachers || 0) / (userStats?.totalStudents + userStats?.totalTeachers + userStats?.totalAdmins || 1) * 100)}%</span>
                </div>
              </div>
              <h4 className="small text-dark">Teachers</h4>
              <p className="small text-muted">{userStats?.totalTeachers.toLocaleString()} users</p>
            </div>

            <div className="col-md-4 text-center">
              <div className="position-relative mx-auto mb-3" style={{ width: '128px', height: '128px' }}>
                <svg className="w-100 h-100" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                  <path
                    className="text-secondary"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-purple"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${Math.round((userStats?.totalAdmins || 0) / (userStats?.totalStudents + userStats?.totalTeachers + userStats?.totalAdmins || 1) * 100)}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="position-absolute top-50 start-50 translate-middle">
                  <span className="fs-4 fw-bold text-purple">{Math.round((userStats?.totalAdmins || 0) / (userStats?.totalStudents + userStats?.totalTeachers + userStats?.totalAdmins || 1) * 100)}%</span>
                </div>
              </div>
              <h4 className="small text-dark">Admins</h4>
              <p className="small text-muted">{userStats?.totalAdmins.toLocaleString()} users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h3 className="h5 mb-3 text-dark">Recent Activity</h3>
          <div className="d-flex flex-column gap-3">
            <div className="p-3 bg-light rounded">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                    <Users size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="small text-dark fw-medium">New user registrations</p>
                    <p className="small text-muted">{userStats?.newUsersThisMonth} new users this month</p>
                  </div>
                </div>
                <span className="small text-muted">2 hours ago</span>
              </div>
            </div>

            <div className="p-3 bg-light rounded">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-success bg-opacity-10 p-2">
                    <BookOpen size={16} className="text-success" />
                  </div>
                  <div>
                    <p className="small text-dark fw-medium">New course published</p>
                    <p className="small text-muted">Advanced Machine Learning</p>
                  </div>
                </div>
                <span className="small text-muted">1 day ago</span>
              </div>
            </div>

            <div className="p-3 bg-light rounded">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-purple bg-opacity-10 p-2">
                    <Award size={16} className="text-purple" />
                  </div>
                  <div>
                    <p className="small text-dark fw-medium">Course completion milestone</p>
                    <p classClassName="small text-muted">{enrollmentStats?.completedEnrollments} course completions</p>
                  </div>
                </div>
                <span className="small text-muted">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserAnalytics = () => (
    <div className="d-flex flex-column gap-4">
      {/* User Growth Chart */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h3 className="h5 mb-3 text-dark">User Growth Trends</h3>
          <div className="row g-3">
            <div className="col-md-4 text-center p-3 bg-primary bg-opacity-10 rounded">
              <div className="h4 mb-1 text-primary">{userStats?.newUsersThisMonth}</div>
              <div className="small text-muted">New Users This Month</div>
              <div className="small text-success mt-1">+15% from last period</div>
            </div>
            <div className="col-md-4 text-center p-3 bg-success bg-opacity-10 rounded">
              <div className="h4 mb-1 text-success">{userStats?.activeUsersThisWeek}</div>
              <div className="small text-muted">Active Users This Week</div>
              <div className="small text-success mt-1">+8% from last week</div>
            </div>
            <div className="col-md-4 text-center p-3 bg-purple bg-opacity-10 rounded">
              <div className="h4 mb-1 text-purple">
                {Math.round((userStats?.activeUsersThisWeek || 0) / (userStats?.totalStudents + userStats?.totalTeachers + userStats?.totalAdmins || 1) * 100)}%
              </div>
              <div className="small text-muted">Weekly Active Rate</div>
              <div className="small text-success mt-1">+2% from last week</div>
            </div>
          </div>
        </div>
      </div>

      {/* User Demographics */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h3 className="h5 mb-3 text-dark">User Demographics</h3>
          <div className="row g-3">
            <div className="col-md-6">
              <h4 className="small text-dark mb-2">User Types</h4>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center justify-content-between">
                  <span className="small text-muted">Students</span>
                  <div className="d-flex align-items-center gap-2">
                    <div className="progress" style={{ width: '96px', height: '8px' }}>
                      <div className="progress-bar bg-primary" style={{ width: `${Math.round((userStats?.totalStudents || 0) / (userStats?.totalStudents + userStats?.totalTeachers + userStats?.totalAdmins || 1) * 100)}%` }}></div>
                    </div>
                    <span className="small text-dark fw-medium">{Math.round((userStats?.totalStudents || 0) / (userStats?.totalStudents + userStats?.totalTeachers + userStats?.totalAdmins || 1) * 100)}%</span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="small text-muted">Teachers</span>
                  <div className="d-flex align-items-center gap-2">
                    <div className="progress" style={{ width: '96px', height: '8px' }}>
                      <div className="progress-bar bg-success" style={{ width: `${Math.round((userStats?.totalTeachers || 0) / (userStats?.totalStudents + userStats?.totalTeachers + userStats?.totalAdmins || 1) * 100)}%` }}></div>
                    </div>
                    <span className="small text-dark fw-medium">{Math.round((userStats?.totalTeachers || 0) / (userStats?.totalStudents + userStats?.totalTeachers + userStats?.totalAdmins || 1) * 100)}%</span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="small text-muted">Admins</span>
                  <div className="d-flex align-items-center gap-2">
                    <div className="progress" style={{ width: '96px', height: '8px' }}>
                      <div className="progress-bar bg-purple" style={{ width: `${Math.round((userStats?.totalAdmins || 0) / (userStats?.totalStudents + userStats?.totalTeachers + userStats?.totalAdmins || 1) * 100)}%` }}></div>
                    </div>
                    <span className="small text-dark fw-medium">{Math.round((userStats?.totalAdmins || 0) / (userStats?.totalStudents + userStats?.totalTeachers + userStats?.totalAdmins || 1) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <h4 className="small text-dark mb-2">Activity Levels</h4>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center justify-content-between">
                  <span className="small text-muted">Highly Active</span>
                  <span className="small text-dark fw-medium">35%</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="small text-muted">Moderately Active</span>
                  <span className="small text-dark fw-medium">45%</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="small text-muted">Low Activity</span>
                  <span className="small text-dark fw-medium">20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourseAnalytics = () => (
    <div className="d-flex flex-column gap-4">
      {/* Course Statistics */}
      <div className="row g-3">
        <div className="col-lg-3 card border-0 shadow-sm">
          <div className="card-body text-center">
            <div className="h4 mb-1 text-primary">{courseStats?.totalCourses}</div>
            <div className="small text-muted">Total Courses</div>
          </div>
        </div>
        <div className="col-lg-3 card border-0 shadow-sm">
          <div className="card-body text-center">
            <div className="h4 mb-1 text-success">{courseStats?.activeCourses}</div>
            <div className="small text-muted">Active Courses</div>
          </div>
        </div>
        <div className="col-lg-3 card border-0 shadow-sm">
          <div className="card-body text-center">
            <div className="h4 mb-1 text-purple">{courseStats?.completedCourses}</div>
            <div className="small text-muted">Completed Courses</div>
          </div>
        </div>
        <div className="col-lg-3 card border-0 shadow-sm">
          <div className="card-body text-center">
            <div className="h4 mb-1 text-orange">{courseStats?.averageEnrollment}</div>
            <div className="small text-muted">Avg Enrollment</div>
          </div>
        </div>
      </div>

      {/* Course Categories */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h3 className="h5 mb-3 text-dark">Course Categories</h3>
          <div className="row g-3">
            <div className="col-md-6">
              <h4 className="small text-dark mb-2">Subject Areas</h4>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Computer Science</span>
                  <span className="text-dark fw-medium">45%</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Mathematics</span>
                  <span className="text-dark fw-medium">25%</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Business</span>
                  <span className="text-dark fw-medium">20%</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Other</span>
                  <span className="text-dark fw-medium">10%</span>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <h4 className="small text-dark mb-2">Course Levels</h4>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Beginner</span>
                  <span className="text-dark fw-medium">40%</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Intermediate</span>
                  <span className="text-dark fw-medium">35%</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Advanced</span>
                  <span className="text-dark fw-medium">25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEnrollmentAnalytics = () => (
    <div className="d-flex flex-column gap-4">
      {/* Enrollment Overview */}
      <div className="row g-3">
        <div className="col-lg-3 card border-0 shadow-sm">
          <div className="card-body text-center">
            <div className="h4 mb-1 text-primary">{enrollmentStats?.totalEnrollments.toLocaleString()}</div>
            <div className="small text-muted">Total Enrollments</div>
          </div>
        </div>
        <div className="col-lg-3 card border-0 shadow-sm">
          <div className="card-body text-center">
            <div className="h4 mb-1 text-success">{enrollmentStats?.activeEnrollments.toLocaleString()}</div>
            <div className="small text-muted">Active Enrollments</div>
          </div>
        </div>
        <div className="col-lg-3 card border-0 shadow-sm">
          <div className="card-body text-center">
            <div className="h4 mb-1 text-purple">{enrollmentStats?.completedEnrollments.toLocaleString()}</div>
            <div className="small text-muted">Completed</div>
          </div>
        </div>
        <div className="col-lg-3 card border-0 shadow-sm">
          <div className="card-body text-center">
            <div className="h4 mb-1 text-orange">{enrollmentStats?.averageCompletionRate}%</div>
            <div className="small text-muted">Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Monthly Growth */}
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center">
          <h3 className="h5 mb-3 text-dark">Monthly Growth</h3>
          <div className="h3 mb-1 text-success">+{enrollmentStats?.monthlyGrowth}%</div>
          <div className="small text-muted">Monthly Growth Rate</div>
          <div className="small text-muted mt-2">Compared to last period</div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceMetrics = () => (
    <div className="d-flex flex-column gap-4">
      {/* System Performance */}
      <div className="row g-3">
        <div className="col-md-6 card border-0 shadow-sm">
          <div className="card-body">
            <h3 className="h5 mb-3 text-dark">System Performance</h3>
            <div className="d-flex flex-column gap-3">
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">Uptime</span>
                  <span className="text-dark fw-medium">{systemStats?.systemUptime}%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-success" style={{ width: `${systemStats?.systemUptime}%` }}></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">Response Time</span>
                  <span className="text-dark fw-medium">120ms</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-primary" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">Error Rate</span>
                  <span className="text-dark fw-medium">0.02%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-success" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 card border-0 shadow-sm">
          <div className="card-body">
            <h3 className="h5 mb-3 text-dark">Quality Metrics</h3>
            <div className="d-flex flex-column gap-3">
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">Course Rating</span>
                  <span className="text-dark fw-medium">{systemStats?.averageCourseRating}/5.0</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-warning" style={{ width: `${(systemStats?.averageCourseRating || 0) * 20}%` }}></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">User Satisfaction</span>
                  <span className="text-dark fw-medium">4.7/5.0</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-success" style={{ width: '94%' }}></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">Support Response</span>
                  <span className="text-dark fw-medium">2.3 hours</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-primary" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportContent = () => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport();
      case 'users':
        return renderUserAnalytics();
      case 'courses':
        return renderCourseAnalytics();
      case 'enrollments':
        return renderEnrollmentAnalytics();
      case 'performance':
        return renderPerformanceMetrics();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 mb-2 text-dark">System Reports</h1>
        <p className="text-muted">Comprehensive analytics and insights for system administrators</p>
      </div>

      {/* Report Controls */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <Filter size={16} className="text-muted" />
              <span className="small text-dark">Timeframe:</span>
            </div>
            
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="form-select form-select-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>

            <div className="flex-grow-1"></div>

            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={exportToExcel}
              disabled={loading || !!error}
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <nav className="nav nav-tabs">
            {reports.map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`nav-link d-flex align-items-center gap-2 small ${selectedReport === report.id ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  {report.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Report Content */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;