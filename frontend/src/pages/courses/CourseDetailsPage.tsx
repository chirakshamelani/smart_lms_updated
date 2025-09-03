import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Bot,
  Lock,
  Edit,
  Trash2,
  BarChart2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Overview from './Overview';
import Lessons from './Lessons';
import Assignments from './Assignments';
import Quizzes from './Quizzes';
import Announcements from './Announcements';
import Students from './Students';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isDeletingCourse, setIsDeletingCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    cover_image: '',
    status: 'draft',
    start_date: '',
    end_date: '',
  });
  const [newLesson, setNewLesson] = useState({
    title: '',
    type: 'lecture',
    content: '',
    order: 1,
    duration_minutes: 0,
    attachment_url: '',
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    is_important: false,
  });
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    due_date: '',
    points: 0,
  });
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [showAddAnnouncementForm, setShowAddAnnouncementForm] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${apiUrl}/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = response.data;
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch course');
        }

        const courseData = result.data;
        // Ensure quizzes have necessary fields
        courseData.quizzes = (courseData.quizzes || []).map((quiz) => ({
          ...quiz,
          question_count: quiz.question_count || 0,
          attempts: quiz.attempts || 0,
        }));
        // Filter invalid data
        courseData.assignments = (courseData.assignments || []).filter(
          (assignment) => assignment && typeof assignment === 'object' && assignment.id
        );
        courseData.announcements = (courseData.announcements || []).filter(
          (announcement) => announcement && typeof announcement === 'object' && announcement.id
        );
        courseData.enrolledStudents = (courseData.enrolledStudents || []).filter(
          (student) => student && typeof student === 'object' && student.id
        );
        setCourse(courseData);
        setCourseForm({
          title: courseData.title || '',
          description: courseData.description || '',
          cover_image: courseData.cover_image || '',
          status: courseData.status || 'draft',
          start_date: courseData.start_date ? courseData.start_date.split('T')[0] : '',
          end_date: courseData.end_date ? courseData.end_date.split('T')[0] : '',
        });
        setNewLesson({
          title: '',
          type: 'lecture',
          content: '',
          order: (courseData.lessons?.length || 0) + 1,
          duration_minutes: 0,
          attachment_url: '',
        });
      } catch (error) {
        console.error('Error fetching course:', error);
        if (error.response?.status === 404) {
          setError('Course not found');
        } else if (error.response?.status === 403) {
          setError(error.response?.data?.error || 'You do not have permission to view this course');
        } else if (error.response?.status >= 500) {
          setError('Server error: Unable to load course details');
        } else {
          setError(error.message || 'Failed to load course details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [apiUrl, id, user, authLoading, navigate]);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    setError(null);
    setEnrollmentSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/courses/${id}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to enroll in course');
      }
      setEnrollmentSuccess(true);
      const courseResponse = await axios.get(`${apiUrl}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = courseResponse.data;
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch updated course');
      }
      const courseData = result.data;
      courseData.quizzes = (courseData.quizzes || []).map((quiz) => ({
        ...quiz,
        question_count: quiz.question_count || 0,
        attempts: quiz.attempts || 0,
      }));
      courseData.assignments = (courseData.assignments || []).filter(
        (assignment) => assignment && typeof assignment === 'object' && assignment.id
      );
      courseData.announcements = (courseData.announcements || []).filter(
        (announcement) => announcement && typeof announcement === 'object' && announcement.id
      );
      courseData.enrolledStudents = (courseData.enrolledStudents || []).filter(
        (student) => student && typeof student === 'object' && student.id
      );
      setCourse(courseData);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setError(error.response?.data?.error || error.message || 'Failed to enroll in course');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    setIsDeletingCourse(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${apiUrl}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete course');
      }
      navigate('/courses');
    } catch (error) {
      console.error('Error deleting course:', error);
      setError(error.response?.data?.error || error.message || 'Failed to delete course');
    } finally {
      setIsDeletingCourse(false);
    }
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${apiUrl}/courses/${id}`,
        courseForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update course');
      }
      const courseData = response.data.data;
      courseData.quizzes = (courseData.quizzes || []).map((quiz) => ({
        ...quiz,
        question_count: quiz.question_count || 0,
        attempts: quiz.attempts || 0,
      }));
      courseData.assignments = (courseData.assignments || []).filter(
        (assignment) => assignment && typeof assignment === 'object' && assignment.id
      );
      courseData.announcements = (courseData.announcements || []).filter(
        (announcement) => announcement && typeof announcement === 'object' && announcement.id
      );
      courseData.enrolledStudents = (courseData.enrolledStudents || []).filter(
        (student) => student && typeof student === 'object' && student.id
      );
      setCourse({ ...course, ...courseData });
      setIsEditingCourse(false);
    } catch (error) {
      console.error('Error updating course:', error);
      setError(error.response?.data?.error || error.message || 'Failed to update course');
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/courses/${id}/lessons`,
        newLesson,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create lesson');
      }
      setCourse({
        ...course,
        lessons: [...(course.lessons || []), response.data.data],
      });
      setNewLesson({
        title: '',
        type: 'lecture',
        content: '',
        order: (course.lessons?.length || 0) + 1,
        duration_minutes: 0,
        attachment_url: '',
      });
    } catch (error) {
      console.error('Error creating lesson:', error);
      setError(error.response?.data?.error || error.message || 'Failed to create lesson');
    }
  };

  const handleUpdateLesson = async (e, lessonId) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${apiUrl}/courses/${id}/lessons/${lessonId}`,
        newLesson,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update lesson');
      }
      setCourse({
        ...course,
        lessons: course.lessons.map((lesson) =>
          lesson.id === lessonId ? response.data.data : lesson
        ),
      });
      setEditingLessonId(null);
      setNewLesson({
        title: '',
        type: 'lecture',
        content: '',
        order: (course.lessons?.length || 0) + 1,
        duration_minutes: 0,
        attachment_url: '',
      });
    } catch (error) {
      console.error('Error updating lesson:', error);
      setError(error.response?.data?.error || error.message || 'Failed to update lesson');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${apiUrl}/courses/${id}/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete lesson');
      }
      setCourse({
        ...course,
        lessons: course.lessons.filter((lesson) => lesson.id !== lessonId),
      });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      setError(error.response?.data?.error || error.message || 'Failed to delete lesson');
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/courses/${id}/assignments`,
        {
          ...newAssignment,
          course_id: parseInt(id),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create assignment');
      }
      setCourse({
        ...course,
        assignments: [...(course.assignments || []), response.data.data].filter(
          (assignment) => assignment && typeof assignment === 'object' && assignment.id
        ),
      });
      setNewAssignment({
        title: '',
        description: '',
        due_date: '',
        points: 0,
      });
    } catch (error) {
      console.error('Error creating assignment:', error);
      setError(error.response?.data?.error || error.message || 'Failed to create assignment');
    }
  };

  const handleUpdateAssignment = async (e, assignmentId) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${apiUrl}/courses/${id}/assignments/${assignmentId}`,
        {
          ...newAssignment,
          course_id: parseInt(id),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update assignment');
      }
      setCourse({
        ...course,
        assignments: course.assignments
          .map((assignment) => (assignment.id === assignmentId ? response.data.data : assignment))
          .filter((assignment) => assignment && typeof assignment === 'object' && assignment.id),
      });
      setEditingAssignmentId(null);
      setNewAssignment({
        title: '',
        description: '',
        due_date: '',
        points: 0,
      });
    } catch (error) {
      console.error('Error updating assignment:', error);
      setError(error.response?.data?.error || error.message || 'Failed to update assignment');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${apiUrl}/courses/${id}/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete assignment');
      }
      setCourse({
        ...course,
        assignments: course.assignments.filter((assignment) => assignment.id !== assignmentId),
      });
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError(error.response?.data?.error || error.message || 'Failed to delete assignment');
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/courses/${id}/announcements`,
        newAnnouncement,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create announcement');
      }
      setCourse({
        ...course,
        announcements: [...(course.announcements || []), response.data.data].filter(
          (announcement) => announcement && typeof announcement === 'object' && announcement.id
        ),
      });
      setNewAnnouncement({
        title: '',
        content: '',
        is_important: false,
      });
      setShowAddAnnouncementForm(false);
    } catch (error) {
      console.error('Error creating announcement:', error);
      setError(error.response?.data?.error || error.message || 'Failed to create announcement');
    }
  };

  const handleUpdateAnnouncement = async (e, announcementId) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${apiUrl}/courses/${id}/announcements/${announcementId}`,
        newAnnouncement,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update announcement');
      }
      setCourse({
        ...course,
        announcements: course.announcements
          .map((announcement) =>
            announcement.id === announcementId ? response.data.data : announcement
          )
          .filter((announcement) => announcement && typeof announcement === 'object' && announcement.id),
      });
      setEditingAnnouncementId(null);
      setNewAnnouncement({
        title: '',
        content: '',
        is_important: false,
      });
      setShowAddAnnouncementForm(false);
    } catch (error) {
      console.error('Error updating announcement:', error);
      setError(error.response?.data?.error || error.message || 'Failed to update announcement');
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${apiUrl}/courses/${id}/announcements/${announcementId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete announcement');
      }
      setCourse({
        ...course,
        announcements: course.announcements.filter((announcement) => announcement.id !== announcementId),
      });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      setError(error.response?.data?.error || error.message || 'Failed to delete announcement');
    }
  };

  const startChatbotForCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/chatbot/start`,
        {
          course_id: parseInt(id),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to start course chatbot');
      }
      const conversationId = response.data.data.conversation.id;
      navigate(`/chatbot/${conversationId}`);
    } catch (error) {
      console.error('Error starting course chatbot:', error);
      setError(error.response?.data?.error || error.message || 'Failed to start course assistant');
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="alert alert-warning" role="alert">
        <AlertCircle size={18} className="me-2" />
        Please log in to access this course.
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <AlertCircle size={18} className="me-2" />
        {error}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="alert alert-warning" role="alert">
        <AlertCircle size={18} className="me-2" />
        No course data available
      </div>
    );
  }

  const isStudentNotEnrolled = user?.role === 'student' && !course.isEnrolled;
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';
  const isCourseCreatorOrAdmin = user?.id === course.instructor_id || user?.role === 'admin';

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h1 className="h2 mb-2">{course.title}</h1>
                  <p className="text-muted">
                    Instructor: {course.instructor_first_name} {course.instructor_last_name}
                  </p>
                </div>
                <div className="d-flex">
                  {user?.role === 'student' && (
                    <>
                      {!course.isEnrolled ? (
                        <button
                          className="btn btn-primary me-2"
                          onClick={handleEnroll}
                          disabled={isEnrolling}
                          aria-label="Enroll in course"
                        >
                          {isEnrolling ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            'Enroll Now'
                          )}
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-primary d-flex align-items-center me-2"
                          onClick={startChatbotForCourse}
                          aria-label="Start course assistant"
                        >
                          <Bot size={16} className="me-1" />
                          Course Assistant
                        </button>
                      )}
                    </>
                  )}
                  {isTeacherOrAdmin && isCourseCreatorOrAdmin && (
                    <>
                      <button
                        className="btn btn-outline-secondary me-2"
                        onClick={() => setIsEditingCourse(true)}
                        aria-label="Edit course"
                      >
                        <Edit size={16} className="me-1" />
                        Edit Course
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={handleDeleteCourse}
                        disabled={isDeletingCourse}
                        aria-label="Delete course"
                      >
                        {isDeletingCourse ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          <>
                            <Trash2 size={16} className="me-1" />
                            Delete Course
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
              {enrollmentSuccess && (
                <div className="alert alert-success mt-3" role="alert">
                  <CheckCircle size={18} className="me-2" />
                  Successfully enrolled in this course!
                </div>
              )}
              <div className="row mt-4">
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <Calendar size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-muted small">Start Date</div>
                      <div>{course.start_date ? new Date(course.start_date).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <Clock size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-muted small">End Date</div>
                      <div>{course.end_date ? new Date(course.end_date).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-muted small">Lessons</div>
                      <div>{course.lessons ? course.lessons.length : 0} Lessons</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Course Tools</h5>
              <div className="list-group">
                {isStudentNotEnrolled ? (
                  <div className="list-group-item list-group-item-action d-flex align-items-center text-muted">
                    <Lock size={18} className="me-2" />
                    Enroll to access course tools
                  </div>
                ) : (
                  <>
                    <Link
                      to={`/courses/${id}/predictions`}
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      aria-label="View AI performance predictions"
                    >
                      <BarChart2 size={18} className="me-2 text-primary" />
                      AI Performance Predictions
                    </Link>
                    {user?.role === 'student' && (
                      <Link
                        to="/mentoring"
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        aria-label="View peer mentoring"
                      >
                        <Users size={18} className="me-2 text-primary" />
                        Peer Mentoring
                      </Link>
                    )}
                    {user?.role === 'teacher' && (
                      <button
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={() => navigate(`/courses/${id}/predictions`)}
                        aria-label="Manage mentorships"
                      >
                        <Users size={18} className="me-2 text-primary" />
                        Manage Mentorships
                      </button>
                    )}
                    <button
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      onClick={startChatbotForCourse}
                      aria-label="Start AI course assistant"
                    >
                      <Bot size={18} className="me-2 text-primary" />
                      AI Course Assistant
                    </button>
                    <Link
                      to={`/messages?courseId=${id}`}
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      aria-label="View course messages"
                    >
                      <MessageSquare size={18} className="me-2 text-primary" />
                      Course Messages
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditingCourse && isTeacherOrAdmin && isCourseCreatorOrAdmin && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Edit Course</h5>
            <form onSubmit={handleEditCourse}>
              <div className="mb-3">
                <label htmlFor="courseTitle" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="courseTitle"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  required
                  aria-label="Course title"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="courseDescription" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="courseDescription"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  rows={4}
                  aria-label="Course description"
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="courseCoverImage" className="form-label">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="courseCoverImage"
                  value={courseForm.cover_image}
                  onChange={(e) => setCourseForm({ ...courseForm, cover_image: e.target.value })}
                  aria-label="Course cover image URL"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="courseStatus" className="form-label">
                  Status
                </label>
                <select
                  className="form-select"
                  id="courseStatus"
                  value={courseForm.status}
                  onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}
                  aria-label="Course status"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="startDate" className="form-label">
                  Start Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  value={courseForm.start_date}
                  onChange={(e) => setCourseForm({ ...courseForm, start_date: e.target.value })}
                  required
                  aria-label="Course start date"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  value={courseForm.end_date}
                  onChange={(e) => setCourseForm({ ...courseForm, end_date: e.target.value })}
                  required
                  aria-label="Course end date"
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" aria-label="Save course changes">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setIsEditingCourse(false)}
                  aria-label="Cancel editing course"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            aria-label="View course overview"
          >
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'lessons' ? 'active' : ''}`}
            onClick={() => setActiveTab('lessons')}
            aria-label="View course lessons"
          >
            Lessons
          </button>
        </li>
        {(!isStudentNotEnrolled || user?.role !== 'student') && (
          <>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'assignments' ? 'active' : ''}`}
                onClick={() => setActiveTab('assignments')}
                disabled={isStudentNotEnrolled}
                aria-label="View course assignments"
              >
                Assignments
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'quizzes' ? 'active' : ''}`}
                onClick={() => setActiveTab('quizzes')}
                disabled={isStudentNotEnrolled}
                aria-label="View course quizzes"
              >
                Quizzes
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'announcements' ? 'active' : ''}`}
                onClick={() => setActiveTab('announcements')}
                disabled={isStudentNotEnrolled}
                aria-label="View course announcements"
              >
                Announcements
              </button>
            </li>
            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'students' ? 'active' : ''}`}
                  onClick={() => setActiveTab('students')}
                  aria-label="View enrolled students"
                >
                  Students
                </button>
              </li>
            )}
          </>
        )}
      </ul>
      <div className="tab-content">
        {activeTab === 'overview' && (
          <Overview course={course} isStudentNotEnrolled={isStudentNotEnrolled} user={user} />
        )}
        {activeTab === 'lessons' && (
          <Lessons
            course={course}
            isStudentNotEnrolled={isStudentNotEnrolled}
            isTeacherOrAdmin={isTeacherOrAdmin}
            isCourseCreatorOrAdmin={isCourseCreatorOrAdmin}
            newLesson={newLesson}
            setNewLesson={setNewLesson}
            editingLessonId={editingLessonId}
            setEditingLessonId={setEditingLessonId}
            handleCreateLesson={handleCreateLesson}
            handleUpdateLesson={handleUpdateLesson}
            handleDeleteLesson={handleDeleteLesson}
            user={user}
          />
        )}
        {activeTab === 'assignments' && !isStudentNotEnrolled && (
          <Assignments
            course={course}
            isStudentNotEnrolled={isStudentNotEnrolled}
            isTeacherOrAdmin={isTeacherOrAdmin}
            isCourseCreatorOrAdmin={isCourseCreatorOrAdmin}
            newAssignment={newAssignment}
            setNewAssignment={setNewAssignment}
            editingAssignmentId={editingAssignmentId}
            setEditingAssignmentId={setEditingAssignmentId}
            handleCreateAssignment={handleCreateAssignment}
            handleUpdateAssignment={handleUpdateAssignment}
            handleDeleteAssignment={handleDeleteAssignment}
            user={user}
          />
        )}
        {activeTab === 'quizzes' && !isStudentNotEnrolled && (
          <Quizzes
            course={course}
            isStudentNotEnrolled={isStudentNotEnrolled}
            isTeacherOrAdmin={isTeacherOrAdmin}
            isCourseCreatorOrAdmin={isCourseCreatorOrAdmin}
            user={user}
          />
        )}
        {activeTab === 'announcements' && !isStudentNotEnrolled && (
          <Announcements
            course={course}
            isStudentNotEnrolled={isStudentNotEnrolled}
            isTeacherOrAdmin={isTeacherOrAdmin}
            isCourseCreatorOrAdmin={isCourseCreatorOrAdmin}
            newAnnouncement={newAnnouncement}
            setNewAnnouncement={setNewAnnouncement}
            editingAnnouncementId={editingAnnouncementId}
            setEditingAnnouncementId={setEditingAnnouncementId}
            handleCreateAnnouncement={handleCreateAnnouncement}
            handleUpdateAnnouncement={handleUpdateAnnouncement}
            handleDeleteAnnouncement={handleDeleteAnnouncement}
            showAddAnnouncementForm={showAddAnnouncementForm}
            setShowAddAnnouncementForm={setShowAddAnnouncementForm}
            user={user}
          />
        )}
        {activeTab === 'students' && (user?.role === 'teacher' || user?.role === 'admin') && (
          <Students course={course} user={user} setCourse={setCourse} />
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;