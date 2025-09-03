import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter, Eye, Edit, Trash2, Download, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { assignmentAPI, courseAPI } from '../../services/api';

interface Assignment {
  id: string;
  title: string;
  description: string;
  course_id: string;
  course_name: string;
  due_date: string;
  points: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  totalStudents?: number;
  submittedCount?: number;
  gradedCount?: number;
}

interface AssignmentSubmission {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  submission_text: string;
  attachment_url?: string;
  submitted_at: string;
  status: 'submitted' | 'graded' | 'late';
  grade?: number;
  points: number;
  feedback?: string;
}

interface Course {
  id: string;
  title: string;
}

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [publishFilter, setPublishFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    due_date: '',
    points: 100,
    is_published: false,
  });
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await assignmentAPI.getAssignments();
        const assignmentsWithStats = await Promise.all(
          response.data.map(async (assignment: Assignment) => {
            try {
              const submissions = await assignmentAPI.getAssignmentSubmissions(assignment.id);
              return {
                ...assignment,
                course_name: assignment.course_name || 'Unknown Course',
                totalStudents: submissions.data.length,
                submittedCount: submissions.data.filter((s: AssignmentSubmission) => ['submitted', 'graded', 'late'].includes(s.status)).length,
                gradedCount: submissions.data.filter((s: AssignmentSubmission) => s.status === 'graded').length,
              };
            } catch (error: any) {
              console.error(`Failed to fetch submissions for assignment ${assignment.id}:`, error.response?.data || error.message);
              return {
                ...assignment,
                course_name: assignment.course_name || 'Unknown Course',
                totalStudents: 0,
                submittedCount: 0,
                gradedCount: 0,
              };
            }
          })
        );
        setAssignments(assignmentsWithStats);
      } catch (error: any) {
        alert(`Failed to fetch assignments: ${error.message}`);
      }
    };

    fetchAssignments();
  }, [courses]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getCourses();
        setCourses(response.data);
      } catch (error: any) {
        alert(`Failed to fetch courses: ${error.message}`);
      }
    };
    fetchCourses();
  }, []);

  // Fetch submissions for selected assignment
  useEffect(() => {
    if (selectedAssignment) {
      const fetchSubmissions = async () => {
        try {
          const response = await assignmentAPI.getAssignmentSubmissions(selectedAssignment.id);
          setSubmissions(response.data);
          setSubmissionError(null);
        } catch (error: any) {
          console.error(`Failed to fetch submissions for assignment ${selectedAssignment.id}:`, error.response?.data || error.message);
          const errorMessage = error.response?.data?.error || 'Failed to fetch submissions';
          setSubmissionError(errorMessage);
          setSubmissions([]); // Fallback to empty array
        }
      };
      fetchSubmissions();
    }
  }, [selectedAssignment]);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await assignmentAPI.createAssignment(formData);
        alert('Assignment created successfully');
      } else {
        await assignmentAPI.updateAssignment(selectedAssignment!.id, formData);
        alert('Assignment updated successfully');
      }
      setShowModal(false);
      const response = await assignmentAPI.getAssignments();
      const assignmentsWithStats = await Promise.all(
        response.data.map(async (assignment: Assignment) => {
          try {
            const submissions = await assignmentAPI.getAssignmentSubmissions(assignment.id);
            return {
              ...assignment,
              course_name: assignment.course_name || 'Unknown Course',
              totalStudents: submissions.data.length,
              submittedCount: submissions.data.filter((s: AssignmentSubmission) => ['submitted', 'graded', 'late'].includes(s.status)).length,
              gradedCount: submissions.data.filter((s: AssignmentSubmission) => s.status === 'graded').length,
            };
          } catch (error: any) {
            console.error(`Failed to fetch submissions for assignment ${assignment.id}:`, error.response?.data || error.message);
            return {
              ...assignment,
              course_name: assignment.course_name || 'Unknown Course',
              totalStudents: 0,
              submittedCount: 0,
              gradedCount: 0,
            };
          }
        })
      );
      setAssignments(assignmentsWithStats);
      setFormData({
        title: '',
        description: '',
        course_id: '',
        due_date: '',
        points: 100,
        is_published: false,
      });
    } catch (error: any) {
      alert(`Failed to ${modalMode} assignment: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await assignmentAPI.deleteAssignment(id);
        alert('Assignment deleted successfully');
        setAssignments(assignments.filter(a => a.id !== id));
        if (selectedAssignment?.id === id) {
          setSelectedAssignment(null);
        }
      } catch (error: any) {
        alert(`Failed to delete assignment: ${error.message}`);
      }
    }
  };

  const handleGradeSubmission = async (submissionId: string, grade: number, feedback: string) => {
    try {
      await assignmentAPI.gradeAssignment(submissionId, { grade, feedback });
      alert('Submission graded successfully');
      const response = await assignmentAPI.getAssignmentSubmissions(selectedAssignment!.id);
      setSubmissions(response.data);
      setSubmissionError(null);
    } catch (error: any) {
      alert(`Failed to grade submission: ${error.message}`);
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (assignment.course_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPublish = publishFilter === 'all' || (publishFilter === 'published' ? assignment.is_published : !assignment.is_published);
    const matchesCourse = courseFilter === 'all' || assignment.course_id === courseFilter;
    return matchesSearch && matchesPublish && matchesCourse;
  });

  const getPublishColor = (is_published: boolean) => {
    return is_published ? 'badge-success' : 'badge-secondary';
  };

  const getSubmissionStatusIcon = (is_published: boolean) => {
    switch (status) {
      case 'submitted': return <Clock size={16} className="text-primary" />;
      case 'graded': return <CheckCircle size={16} className="text-success" />;
      case 'late': return <AlertCircle size={16} className="text-warning" />;
      default: return <Clock size={16} className="text-secondary" />;
    }
  };

  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'badge-danger';
      case 'graded': return 'badge-success';
      case 'late': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="container my-4">
      <div className="mb-4">
        <h1 className="h2 fw-bold">Assignments</h1>
        <p className="text-muted">Manage and grade student assignments across all your courses</p>
      </div>

      {/* Filters and Search */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <Filter size={16} />
              <span className="small">Filters:</span>
            </div>
            
            <select
              value={publishFilter}
              onChange={(e) => setPublishFilter(e.target.value)}
              className="form-select form-select-sm w-auto"
            >
              <option value="all">All Publish Status</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>

            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="form-select form-select-sm w-auto"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>

            <div className="input-group input-group-sm w-auto">
              <span className="input-group-text">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
              />
            </div>

            <button
              onClick={() => {
                setModalMode('create');
                setShowModal(true);
              }}
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
            >
              <Plus size={16} />
              Create Assignment
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Assignments List */}
        <div className="col-lg-4 mb-4">
          <h2 className="h5 fw-semibold mb-3">All Assignments</h2>
          <div className="d-flex flex-column gap-3">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                onClick={() => setSelectedAssignment(assignment)}
                className={`card cursor-pointer ${selectedAssignment?.id === assignment.id ? 'border-primary shadow' : ''}`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0 small">{assignment.title}</h5>
                    <span className={`badge ${getPublishColor(assignment.is_published)} small`}>
                      {assignment.is_published ? 'Published' : 'Unpublished'}
                    </span>
                  </div>
                  
                  <p className="card-text small text-muted mb-2">{assignment.course_name}</p>
                  
                  <div className="d-flex align-items-center gap-3 small text-muted mb-2">
                    <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between small text-muted">
                    <span>{assignment.submittedCount}/{assignment.totalStudents} submitted</span>
                    <span>{assignment.gradedCount} graded</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Details and Submissions */}
        <div className="col-lg-8">
          {selectedAssignment ? (
            <div className="d-flex flex-column gap-4">
              {/* Assignment Header */}
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h2 className="h4 fw-semibold">{selectedAssignment.title}</h2>
                      <p className="text-muted mb-2">{selectedAssignment.course_name}</p>
                      <div className="d-flex align-items-center gap-3 small text-muted">
                        <span>Due: {new Date(selectedAssignment.due_date).toLocaleDateString()}</span>
                        <span>Points: {selectedAssignment.points}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button 
                        onClick={() => {
                          setModalMode('edit');
                          setFormData({
                            title: selectedAssignment.title,
                            description: selectedAssignment.description,
                            course_id: selectedAssignment.course_id,
                            due_date: selectedAssignment.due_date.split('T')[0],
                            points: selectedAssignment.points,
                            is_published: selectedAssignment.is_published,
                          });
                          setShowModal(true);
                        }}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(selectedAssignment.id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="row text-center">
                    <div className="col">
                      <div className="h5 text-primary">{selectedAssignment.totalStudents}</div>
                      <div className="small text-muted">Total Students</div>
                    </div>
                    <div className="col">
                      <div className="h5 text-success">{selectedAssignment.submittedCount}</div>
                      <div className="small text-muted">Submitted</div>
                    </div>
                    <div className="col">
                      <div className="h5 text-purple">{selectedAssignment.gradedCount}</div>
                      <div className="small text-muted">Graded</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submissions */}
              <div className="card">
                <div className="card-header">
                  <h3 className="h5 mb-0">Student Submissions</h3>
                </div>
                <div className="card-body">
                  {submissionError ? (
                    <div className="alert alert-warning" role="alert">
                      {submissionError}
                    </div>
                  ) : submissions.length === 0 ? (
                    <div className="text-center text-muted">
                      No submissions available for this assignment.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th scope="col" className="small">Student</th>
                            <th scope="col" className="small">Status</th>
                            <th scope="col" className="small">Submitted</th>
                            <th scope="col" className="small">Score</th>
                            <th scope="col" className="small">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submissions.map((submission) => (
                            <tr key={submission.id}>
                              <td>
                                <div className="small">{submission.first_name} {submission.last_name}</div>
                                <div className="small text-muted">{submission.email}</div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  {getSubmissionStatusIcon(submission.status)}
                                  <span className={`badge ${getSubmissionStatusColor(submission.status)} small`}>
                                    {submission.status}
                                  </span>
                                </div>
                              </td>
                              <td className="small">
                                {submission.submitted_at ? new Date(submission.submitted_at).toLocaleDateString() : 'Not submitted'}
                              </td>
                              <td className="small">
                                {submission.grade !== undefined && submission.grade !== null ? (
                                  <span>{submission.grade}/{submission.points}</span>
                                ) : (
                                  <span className="text-muted">Not graded</span>
                                )}
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button className="btn btn-outline-primary btn-sm">
                                    <Eye size={16} />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      const grade = prompt('Enter grade:');
                                      const feedback = prompt('Enter feedback:');
                                      if (grade && feedback) {
                                        handleGradeSubmission(submission.id, parseInt(grade), feedback);
                                      }
                                    }}
                                    className="btn btn-outline-success btn-sm"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  {submission.attachment_url && (
                                    <a href={submission.attachment_url} className="btn btn-outline-secondary btn-sm">
                                      <Download size={16} />
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center">
              <div className="card-body">
                <FileText size={64} className="text-muted mb-3" />
                <h3 className="h5 fw-semibold mb-2">Select an Assignment</h3>
                <p className="text-muted">Choose an assignment from the list to view details and submissions</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalMode === 'create' ? 'Create Assignment' : 'Edit Assignment'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateOrUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="form-control"
                      rows={4}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Course</label>
                    <select
                      value={formData.course_id}
                      onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                      className="form-select"
                      required
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Points</label>
                    <input
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="form-check-input"
                      id="isPublished"
                    />
                    <label className="form-check-label" htmlFor="isPublished">Published</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {modalMode === 'create' ? 'Create' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;