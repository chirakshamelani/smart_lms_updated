import React, { useState } from 'react';
import { MessageSquare, Edit, Trash2 } from 'lucide-react';

const Announcements = ({
  course,
  isStudentNotEnrolled,
  isTeacherOrAdmin,
  isCourseCreatorOrAdmin, // Updated prop name
  newAnnouncement,
  setNewAnnouncement,
  editingAnnouncementId,
  setEditingAnnouncementId,
  handleCreateAnnouncement,
  handleUpdateAnnouncement,
  handleDeleteAnnouncement,
  user // Added for debugging
}) => {
  const [showAddAnnouncementForm, setShowAddAnnouncementForm] = useState(false);

  // Debugging: Log props to verify values
  console.log('Announcements Component Props:', {
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
          <h5 className="card-title mb-0">Course Announcements</h5>
          {isTeacherOrAdmin && isCourseCreatorOrAdmin && (
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setShowAddAnnouncementForm(!showAddAnnouncementForm);
                if (showAddAnnouncementForm) {
                  setEditingAnnouncementId(null);
                  setNewAnnouncement({
                    title: '',
                    content: '',
                    is_important: false
                  });
                }
              }}
            >
              {showAddAnnouncementForm ? 'Cancel' : 'Add Announcement'}
            </button>
          )}
        </div>
        
        {isTeacherOrAdmin && isCourseCreatorOrAdmin && showAddAnnouncementForm && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="mb-3">{editingAnnouncementId ? 'Edit Announcement' : 'Add New Announcement'}</h6>
              <form onSubmit={(e) => {
                if (editingAnnouncementId) {
                  handleUpdateAnnouncement(e, editingAnnouncementId);
                } else {
                  handleCreateAnnouncement(e);
                }
                setShowAddAnnouncementForm(false);
              }}>
                <div className="mb-3">
                  <label htmlFor="announcementTitle" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="announcementTitle"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="announcementContent" className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    id="announcementContent"
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    rows={4}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="announcementImportant"
                      checked={newAnnouncement.is_important}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, is_important: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="announcementImportant">
                      Mark as Important
                    </label>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingAnnouncementId ? 'Update Announcement' : 'Add Announcement'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={() => {
                      setEditingAnnouncementId(null);
                      setNewAnnouncement({
                        title: '',
                        content: '',
                        is_important: false
                      });
                      setShowAddAnnouncementForm(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {course.announcements && course.announcements.length > 0 ? (
          <div className="list-group">
            {course.announcements
              .filter(announcement => announcement && typeof announcement === 'object' && announcement.id)
              .map((announcement) => (
                <div key={announcement.id} className="list-group-item border-0 border-bottom px-0 py-3">
                  <div className="d-flex align-items-start">
                    <div className="avatar bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3">
                      {announcement.first_name?.charAt(0) || 'U'}{announcement.last_name?.charAt(0) || 'N'}
                    </div>
                    <div className="w-100">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="mb-0">
                          {announcement.is_important && (
                            <span className="badge bg-danger me-2">Important</span>
                          )}
                          {announcement.title || 'Untitled'}
                        </h6>
                        <small className="text-muted">
                          {announcement.created_at ? new Date(announcement.created_at).toLocaleDateString() : 'No date'}
                        </small>
                      </div>
                      <div className="text-muted small mb-2">
                        Posted by {announcement.first_name || 'Unknown'} {announcement.last_name || 'User'}
                      </div>
                      <p className="mb-0">{announcement.content || 'No content'}</p>
                      {isTeacherOrAdmin && isCourseCreatorOrAdmin && (
                        <div className="d-flex gap-2 mt-2">
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              setEditingAnnouncementId(announcement.id);
                              setNewAnnouncement({
                                title: announcement.title || '',
                                content: announcement.content || '',
                                is_important: announcement.is_important || false
                              });
                              setShowAddAnnouncementForm(true);
                            }}
                          >
                            <Edit size={14} className="me-1" />
                            Edit
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                          >
                            <Trash2 size={14} className="me-1" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <MessageSquare size={48} className="text-muted mb-3" />
            <h5>No announcements yet</h5>
            <p className="text-muted">
              There are no announcements for this course yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;