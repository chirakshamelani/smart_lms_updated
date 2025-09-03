import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Edit, Trash2 } from 'lucide-react';

const Assignments = ({
  course,
  isStudentNotEnrolled,
  isTeacherOrAdmin,
  isCourseCreatorOrAdmin, // Updated prop name
  newAssignment,
  setNewAssignment,
  editingAssignmentId,
  setEditingAssignmentId,
  handleCreateAssignment,
  handleUpdateAssignment,
  handleDeleteAssignment,
  user // Added for debugging
}) => {
  const [showAddAssignmentForm, setShowAddAssignmentForm] = useState(false);

  // Debugging: Log props to verify values
  console.log('Assignments Component Props:', {
    isTeacherOrAdmin,
    isCourseCreatorOrAdmin,
    userRole: user?.role,
    userId: user?.id,
    courseInstructorId: course?.instructor_id
  });

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0">Course Assignments</h5>
          {isTeacherOrAdmin && isCourseCreatorOrAdmin && (
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setShowAddAssignmentForm(!showAddAssignmentForm);
                if (showAddAssignmentForm) {
                  setEditingAssignmentId(null);
                  setNewAssignment({
                    title: '',
                    description: '',
                    due_date: '',
                    points: 0
                  });
                }
              }}
            >
              {showAddAssignmentForm ? 'Cancel' : 'Add Assignment'}
            </button>
          )}
        </div>
        
        {isTeacherOrAdmin && isCourseCreatorOrAdmin && showAddAssignmentForm && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="mb-3">{editingAssignmentId ? 'Edit Assignment' : 'Add New Assignment'}</h6>
              <form onSubmit={(e) => editingAssignmentId ? handleUpdateAssignment(e, editingAssignmentId) : handleCreateAssignment(e)}>
                <div className="mb-3">
                  <label htmlFor="assignmentTitle" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="assignmentTitle"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="assignmentDescription" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="assignmentDescription"
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    rows={4}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="assignmentDueDate" className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="assignmentDueDate"
                    value={newAssignment.due_date}
                    onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="assignmentPoints" className="form-label">Points</label>
                  <input
                    type="number"
                    className="form-control"
                    id="assignmentPoints"
                    value={newAssignment.points}
                    onChange={(e) => setNewAssignment({ ...newAssignment, points: parseInt(e.target.value) || 0 })}
                    min={0}
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingAssignmentId ? 'Update Assignment' : 'Add Assignment'}
                  </button>
                  {editingAssignmentId && (
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary" 
                      onClick={() => {
                        setEditingAssignmentId(null);
                        setNewAssignment({
                          title: '',
                          description: '',
                          due_date: '',
                          points: 0
                        });
                        setShowAddAssignmentForm(false);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
        
        {course.assignments && course.assignments.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Due Date</th>
                  <th>Points</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {course.assignments
                  .filter(assignment => assignment && typeof assignment === 'object' && assignment.id)
                  .map((assignment) => (
                    <tr key={assignment.id}>
                      <td>{assignment.title || 'Untitled'}</td>
                      <td>{assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}</td>
                      <td>{assignment.points || 0}</td>
                      <td>
                        <span className="badge bg-warning">Pending</span>
                      </td>
                      <td>
                        <Link 
                          to={`/courses/${course.id}/assignments/${assignment.id}`}
                          className="btn btn-sm btn-primary me-2"
                        >
                          View
                        </Link>
                        {isTeacherOrAdmin && isCourseCreatorOrAdmin && (
                          <>
                            <button 
                              className="btn btn-outline-secondary btn-sm me-2"
                              onClick={() => {
                                setEditingAssignmentId(assignment.id);
                                setNewAssignment({
                                  title: assignment.title || '',
                                  description: assignment.description || '',
                                  due_date: assignment.due_date ? assignment.due_date.split('T')[0] : '',
                                  points: assignment.points || 0
                                });
                                setShowAddAssignmentForm(true);
                              }}
                            >
                              <Edit size={14} className="me-1" />
                              Edit
                            </button>
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteAssignment(assignment.id)}
                            >
                              <Trash2 size={14} className="me-1" />
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <FileText size={48} className="text-muted mb-3" />
            <h5>No assignments available yet</h5>
            <p className="text-muted">
              The instructor hasn't added any assignments to this course yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;