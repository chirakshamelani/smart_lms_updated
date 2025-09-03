import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { courseAPI } from '../../services/api';
import { BarChart2, CheckCircle, XCircle } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ProgressPage = () => {
  const { courseId, studentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        // Check if user has permission (teacher/admin or viewing own progress)
        if (user.role !== 'admin' && user.role !== 'teacher' && user.id !== parseInt(studentId)) {
          throw new Error('Unauthorized access');
        }

        // Fetch course lessons
        const lessonsResponse = await courseAPI.getLessons(courseId);
        setLessons(lessonsResponse.data || []);

        // Fetch student progress
        const progressResponse = await courseAPI.getStudentProgress(courseId, studentId);
        setProgressData(progressResponse.data || []);

        // Fetch student details
        const studentResponse = await courseAPI.getStudent(courseId, studentId);
        setStudent(studentResponse.data);

      } catch (err) {
        setError(err.message || 'Failed to load progress data');
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [courseId, studentId, user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        {error}
      </div>
    );
  }

  // Calculate completion percentage
  const completedLessons = progressData.filter(progress => progress.completed).length;
  const completionPercentage = lessons.length > 0 
    ? Math.round((completedLessons / lessons.length) * 100)
    : 0;

  return (
    <div className="container mt-4">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Progress for {student?.first_name || 'Student'} {student?.last_name || ''} 
          </h5>
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            Back to Course
          </button>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <h6>Overall Progress</h6>
            <div className="progress" style={{ height: '20px' }}>
              <div 
                className="progress-bar bg-success" 
                role="progressbar" 
                style={{ width: `${completionPercentage}%` }}
                aria-valuenow={completionPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {completionPercentage}%
              </div>
            </div>
            <p className="mt-2">
              {completedLessons} of {lessons.length} lessons completed
            </p>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Lesson</th>
                  <th>Status</th>
                  <th>Completed At</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map(lesson => {
                  const progress = progressData.find(p => p.lesson_id === lesson.id);
                  return (
                    <tr key={lesson.id}>
                      <td>{lesson.title || 'Untitled Lesson'}</td>
                      <td>
                        {progress?.completed ? (
                          <span className="badge bg-success d-flex align-items-center">
                            <CheckCircle size={14} className="me-1" />
                            Completed
                          </span>
                        ) : (
                          <span className="badge bg-warning d-flex align-items-center">
                            <XCircle size={14} className="me-1" />
                            Not Completed
                          </span>
                        )}
                      </td>
                      <td>
                        {progress?.completed_at 
                          ? new Date(progress.completed_at).toLocaleDateString()
                          : '-'
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {lessons.length === 0 && (
            <div className="text-center py-5">
              <BarChart2 size={48} className="text-muted mb-3" />
              <h5>No lessons found</h5>
              <p className="text-muted">
                This course currently has no lessons to track progress for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;