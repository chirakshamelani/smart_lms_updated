import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, BarChart2, Trash2, MessageSquare } from 'lucide-react';
import { courseAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const Students = ({ course, isCourseCreatorOrAdmin, setCourse }) => {
  const [isUnenrolling, setIsUnenrolling] = useState({});
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const isTeacherOrAdmin = authUser?.role === 'teacher' || authUser?.role === 'admin';

  // Debugging: Log props to verify values
  console.log('Students Component Props:', {
    isTeacherOrAdmin,
    isCourseCreatorOrAdmin,
    userRole: authUser?.role,
    userId: authUser?.id,
    courseInstructorId: course?.instructor_id
  });

  const handleUnenrollStudent = async (studentId) => {
    const student = course.enrolledStudents.find(s => s.id === studentId);
    if (!student) {
      alert('Student not found');
      return;
    }
    if (!window.confirm(`Are you sure you want to unenroll ${student.first_name || 'this student'} from the course?`)) return;

    setIsUnenrolling(prev => ({ ...prev, [studentId]: true }));
    try {
      if (!course.id || !studentId) {
        throw new Error('Invalid course ID or student ID');
      }
      await courseAPI.unenrollStudent(course.id, studentId);
      setCourse({
        ...course,
        enrolledStudents: course.enrolledStudents.filter(student => student.id !== studentId)
      });
    } catch (error) {
      console.error('Error unenrolling student:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to unenroll student');
    } finally {
      setIsUnenrolling(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const handleMessageStudent = (studentId) => {
    navigate(`/messages?otherUserId=${studentId}`);
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Enrolled Students</h5>
        <div>
          <Link 
            to={`/courses/${course.id}/predictions`}
            className="btn btn-outline-primary btn-sm d-flex align-items-center"
          >
            <BarChart2 size={14} className="me-1" />
            View Predictions
          </Link>
        </div>
      </div>
      <div className="card-body p-0">
        {course.enrolledStudents && course.enrolledStudents.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Enrollment Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {course.enrolledStudents
                  .filter(student => student && typeof student === 'object' && student.id)
                  .map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-2">
                            {(student.first_name?.charAt(0) || 'U')}{(student.last_name?.charAt(0) || 'N')}
                          </div>
                          <div>
                            {student.first_name || 'Unknown'} {student.last_name || 'User'}
                          </div>
                        </div>
                      </td>
                      <td>{student.email || 'No email'}</td>
                      <td>{student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : 'No date'}</td>
                      <td>
                        <span className="badge bg-success">Active</span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => navigate(`/courses/${course.id}/students/${student.id}/progress`)}
                        >
                          View Progress
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => handleMessageStudent(student.id)}
                        >
                          <MessageSquare size={14} className="me-1" />
                          Message
                        </button>
                        {isTeacherOrAdmin && isCourseCreatorOrAdmin && (
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleUnenrollStudent(student.id)}
                            disabled={isUnenrolling[student.id]}
                          >
                            {isUnenrolling[student.id] ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <>
                                <Trash2 size={14} className="me-1" />
                                Unenroll
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <Users size={48} className="text-muted mb-3" />
            <h5>No students enrolled yet</h5>
            <p className="text-muted">
              There are no students enrolled in this course yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;