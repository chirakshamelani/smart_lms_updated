import React, { useState } from 'react';
import { BookOpen, FileText, Clock, Edit, Trash2 } from 'lucide-react';

const Lessons = ({
  course,
  isStudentNotEnrolled,
  isTeacherOrAdmin,
  isCourseCreatorOrAdmin, // Updated prop name
  newLesson,
  setNewLesson,
  editingLessonId,
  setEditingLessonId,
  handleCreateLesson,
  handleUpdateLesson,
  handleDeleteLesson,
  user // Required for debugging and potential fallback
}) => {
  const [showAddLessonForm, setShowAddLessonForm] = useState(false);

  // Debugging: Log props to verify values
  console.log('Lessons Component Props:', {
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
          <h5 className="card-title mb-0">Course Lessons</h5>
          {isTeacherOrAdmin && isCourseCreatorOrAdmin && (
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setShowAddLessonForm(!showAddLessonForm);
                if (showAddLessonForm) {
                  setEditingLessonId(null);
                  setNewLesson({
                    title: '',
                    type: 'lecture',
                    content: '',
                    order: (course.lessons?.length || 0) + 1,
                    duration_minutes: 0,
                    attachment_url: ''
                  });
                }
              }}
            >
              {showAddLessonForm ? 'Cancel' : 'Add Lesson'}
            </button>
          )}
        </div>
        
        {isTeacherOrAdmin && isCourseCreatorOrAdmin && showAddLessonForm && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="mb-3">{editingLessonId ? 'Edit Lesson' : 'Add New Lesson'}</h6>
              <form onSubmit={(e) => editingLessonId ? handleUpdateLesson(e, editingLessonId) : handleCreateLesson(e)}>
                <div className="mb-3">
                  <label htmlFor="lessonTitle" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lessonTitle"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lessonType" className="form-label">Type</label>
                  <select
                    className="form-select"
                    id="lessonType"
                    value={newLesson.type}
                    onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value })}
                  >
                    <option value="lecture">Lecture</option>
                    <option value="video">Video</option>
                    <option value="reading">Reading</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="lessonContent" className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    id="lessonContent"
                    value={newLesson.content}
                    onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                    rows={4}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="lessonOrder" className="form-label">Order</label>
                  <input
                    type="number"
                    className="form-control"
                    id="lessonOrder"
                    value={newLesson.order}
                    onChange={(e) => setNewLesson({ ...newLesson, order: parseInt(e.target.value) })}
                    min={1}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lessonDuration" className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="lessonDuration"
                    value={newLesson.duration_minutes}
                    onChange={(e) => setNewLesson({ ...newLesson, duration_minutes: parseInt(e.target.value) })}
                    min={0}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lessonAttachment" className="form-label">Attachment URL</label>
                  <input
                    type="url"
                    className="form-control"
                    id="lessonAttachment"
                    value={newLesson.attachment_url}
                    onChange={(e) => setNewLesson({ ...newLesson, attachment_url: e.target.value })}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingLessonId ? 'Update Lesson' : 'Add Lesson'}
                  </button>
                  {editingLessonId && (
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary" 
                      onClick={() => {
                        setEditingLessonId(null);
                        setNewLesson({
                          title: '',
                          type: 'lecture',
                          content: '',
                          order: (course.lessons?.length || 0) + 1,
                          duration_minutes: 0,
                          attachment_url: ''
                        });
                        setShowAddLessonForm(false);
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
        
        {course.lessons && course.lessons.length > 0 ? (
          <div className="accordion" id="lessonsAccordion">
            {course.lessons.map((lesson, index) => (
              <div className="accordion-item border mb-3 rounded overflow-hidden" key={lesson.id}>
                <h2 className="accordion-header" id={`heading-${lesson.id}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#lesson-${lesson.id}`}
                    aria-expanded="false"
                    aria-controls={`lesson-${lesson.id}`}
                  >
                    <span className="me-2 badge bg-primary rounded-circle">
                      {lesson.order}
                    </span>
                    {lesson.title}
                  </button>
                </h2>
                <div
                  id={`lesson-${lesson.id}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading-${lesson.id}`}
                  data-bs-parent="#lessonsAccordion"
                >
                  <div className="accordion-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center text-muted small mb-2">
                          <FileText size={14} className="me-1" />
                          Type: {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center text-muted small mb-2">
                          <Clock size={14} className="me-1" />
                          Duration: {lesson.duration_minutes} minutes
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p>{lesson.content}</p>
                    </div>
                    
                    {lesson.attachment_url && (
                      <div className="mb-3">
                        <a 
                          href={lesson.attachment_url} 
                          className="btn btn-outline-primary btn-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Attachment
                        </a>
                      </div>
                    )}
                    
                    {isTeacherOrAdmin && isCourseCreatorOrAdmin && (
                      <div className="d-flex gap-2 mb-3">
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => {
                            setEditingLessonId(lesson.id);
                            setNewLesson({
                              title: lesson.title,
                              type: lesson.type,
                              content: lesson.content,
                              order: lesson.order,
                              duration_minutes: lesson.duration_minutes,
                              attachment_url: lesson.attachment_url || ''
                            });
                            setShowAddLessonForm(true);
                          }}
                        >
                          <Edit size={14} className="me-1" />
                          Edit
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteLesson(lesson.id)}
                        >
                          <Trash2 size={14} className="me-1" />
                          Delete
                        </button>
                      </div>
                    )}
                    
                    <button 
                      className="btn btn-primary"
                      disabled={isStudentNotEnrolled}
                    >
                      {isStudentNotEnrolled ? 'Enroll to Start Lesson' : 'Start Lesson'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <BookOpen size={48} className="text-muted mb-3" />
            <h5>No lessons available yet</h5>
            <p className="text-muted">
              The instructor hasn't added any lessons to this course yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;