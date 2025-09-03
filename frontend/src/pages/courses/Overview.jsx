import React from 'react';
import { FileText, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Overview = ({ course, isStudentNotEnrolled }) => {
  return (
    <div className="fade-in">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Course Description</h5>
          <p>{course.description ?? 'No description available'}</p>
        </div>
      </div>
      
      {!isStudentNotEnrolled && (
        <div className="row">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">Recent Announcements</h5>
              </div>
              <div className="card-body p-0">
                {course.announcements && course.announcements.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {course.announcements.slice(0, 3).map((announcement) => (
                      <div key={announcement.id} className="list-group-item p-3 border-0 border-bottom">
                        <h6>{announcement.title}</h6>
                        <div className="text-muted small mb-2">
                          {new Date(announcement.created_at).toLocaleDateString()} • {announcement.first_name} {announcement.last_name}
                        </div>
                        <p className="mb-0">{announcement.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted">No announcements yet</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">Upcoming Deadlines</h5>
              </div>
              <div className="card-body p-0">
                {course.assignments && course.assignments.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {course.assignments.slice(0, 2).map((assignment) => (
                      <div key={assignment.id} className="list-group-item border-0 border-bottom p-3">
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-warning bg-opacity-10 p-2 me-3">
                            <FileText size={16} className="text-warning" />
                          </div>
                          <div>
                            <div>{assignment.title}</div>
                            <div className="text-muted small">
                              Due: {new Date(assignment.due_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-3 text-muted">No upcoming deadlines</p>
                )}
              </div>
            </div>
            
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">Your Progress</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Course Completion</span>
                    <span>45%</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-primary" 
                      role="progressbar" 
                      style={{ width: '45%' }} 
                      aria-valuenow={45} 
                      aria-valuemin={0} 
                      aria-valuemax={100}
                    ></div>
                  </div>
                </div>
                
                <div className="d-grid gap-2 mt-3">
                  <Link 
                    to={`/courses/${course.id}/predictions`} 
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                  >
                    <Award size={16} className="me-2" />
                    View Performance Prediction
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;