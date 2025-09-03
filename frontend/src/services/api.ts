import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Generic API call function
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const config = {
    ...options,
    data: options.body, // Changed from body to data for axios
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await axios(`${API_BASE_URL}${endpoint}`, config);
    console.log(`API response for ${endpoint}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, {
      rawError: error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });
    if (error.response?.status === 401 && error.response?.data?.error === 'Token expired') {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
    const errorMessage = error.response?.data?.error || `HTTP error! status: ${error.response?.status || 'unknown'}`;
    const axiosError = new Error(errorMessage);
    axiosError.response = error.response; // Preserve full response for debugging
    throw axiosError;
  }
}

// Calendar API calls
export const calendarAPI = {
  getEvents: () => apiCall('/calendar'),
  getEventsByRange: (startDate, endDate) => 
    apiCall(`/calendar/range?startDate=${startDate}&endDate=${endDate}`),
  createEvent: (eventData) => 
    apiCall('/calendar', { method: 'POST', body: JSON.stringify(eventData) }),
  updateEvent: (id, eventData) => 
    apiCall(`/calendar/${id}`, { method: 'PUT', body: JSON.stringify(eventData) }),
  deleteEvent: (id) => 
    apiCall(`/calendar/${id}`, { method: 'DELETE' }),
  getAllEvents: () => apiCall('/calendar/debug/all'),
};

// Grades API calls
export const gradesAPI = {
  getGrades: () => apiCall('/grades'),
  getGradesByCourse: (courseId) => 
    apiCall(`/grades/course/${courseId}`),
  getGradeSummary: () => apiCall('/grades/summary'),
  getGradesByType: (type) => 
    apiCall(`/grades/type/${type}`),
  getGradeStats: () => apiCall('/grades/stats'),
};

// Messages API calls
export const messagesAPI = {
  getConversations: () => apiCall('/messages/conversations'),
  getConversation: (otherUserId) => apiCall(`/messages/conversation/${otherUserId}`),
  sendMessage: (formData) => apiCall('/messages', { method: 'POST', body: formData }),
  markAsRead: (messageId) => apiCall(`/messages/${messageId}/read`, { method: 'PUT' }),
  getUnreadCount: () => apiCall('/messages/unread/count'),
  deleteMessage: (messageId) => apiCall(`/messages/${messageId}`, { method: 'DELETE' }),
  searchUsers: ({ query, exact = false }) =>
    apiCall(exact ? `/messages/users/${query}` : `/messages/users/search?query=${encodeURIComponent(query)}`),
};

// Settings API calls
export const settingsAPI = {
  getSettings: () => apiCall('/settings'),
  updateSettings: (settingsData) => 
    apiCall('/settings', { method: 'PUT', body: JSON.stringify(settingsData) }),
  updateSetting: (setting, value) => 
    apiCall(`/settings/${setting}`, { method: 'PATCH', body: JSON.stringify({ value }) }),
  updatePreference: (key, value) => 
    apiCall(`/settings/preferences/${key}`, { method: 'PATCH', body: JSON.stringify({ value }) }),
  resetSettings: () => 
    apiCall('/settings/reset', { method: 'POST' }),
  getTimezones: () => apiCall('/settings/timezones'),
  getLanguages: () => apiCall('/settings/languages'),
};

// Help API calls
export const helpAPI = {
  getArticles: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());
    
    const queryString = searchParams.toString();
    return apiCall(`/help${queryString ? `?${queryString}` : ''}`);
  },
  getArticle: (id) => apiCall(`/help/${id}`),
  getCategories: () => apiCall('/help/categories/list'),
  getPopularArticles: (limit) => 
    apiCall(`/help/popular/list${limit ? `?limit=${limit}` : ''}`),
  searchArticles: (query, category, limit) => {
    const searchParams = new URLSearchParams({ q: query });
    if (category) searchParams.append('category', category);
    if (limit) searchParams.append('limit', limit.toString());
    
    return apiCall(`/help/search/query?${searchParams.toString()}`);
  },
};

// Auth API calls
export const authAPI = {
  login: (credentials) => 
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => 
    apiCall('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
};

// User API calls
export const userAPI = {
  getProfile: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/profile`);
      return res.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },
  updateProfile: async (profileData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/users/profile`, profileData);
      return res.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  changePassword: async (passwordData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/users/change-password`, passwordData);
      return res.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },
  getStudents: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users`);
      return res.data.data.filter((u: any) => u.role === 'student');
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },
  createStudent: async (studentData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/users`, studentData);
      return res.data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },
  updateStudent: async (id: number, studentData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/users/${id}`, studentData);
      return res.data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },
  deleteStudent: async (id: number) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/users/${id}`);
      return res.data;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },
  getTeachers: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users`);
      return res.data.data.filter((u: any) => u.role === 'teacher');
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  },
  createTeacher: async (teacherData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/users`, teacherData);
      return res.data;
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw error;
    }
  },
  updateTeacher: async (id: number, teacherData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/users/${id}`, teacherData);
      return res.data;
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  },
  deleteTeacher: async (id: number) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/users/${id}`);
      return res.data;
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw error;
    }
  },
  toggleUserStatus: async (id: number, isActive: boolean) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/users/${id}/status`, { is_active: isActive });
      return res.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },
};

// Course API calls
export const courseAPI = {
  getCourses: () => apiCall('/courses'),
  getCourse: (id) => apiCall(`/courses/${id}`),
  createCourse: (courseData) => 
    apiCall('/courses', { method: 'POST', body: JSON.stringify(courseData) }),
  updateCourse: (id, courseData) => 
    apiCall(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(courseData) }),
  deleteCourse: (id) => 
    apiCall(`/courses/${id}`, { method: 'DELETE' }),
  getEnrolledCourses: () => apiCall('/courses/enrolled/me'),
  enrollCourse: (id) => 
    apiCall(`/courses/${id}/enroll`, { method: 'POST' }),
  unenrollStudent: (courseId, userId) => 
    apiCall(`/courses/${courseId}/enroll/${userId}`, { method: 'DELETE' }),
  getAnnouncements: (courseId) => 
    apiCall(`/courses/${courseId}/announcements`),
  createAnnouncement: (courseId, announcementData) => 
    apiCall(`/courses/${courseId}/announcements`, { method: 'POST', body: JSON.stringify(announcementData) }),
  updateAnnouncement: (courseId, announcementId, announcementData) => 
    apiCall(`/courses/${courseId}/announcements/${announcementId}`, { method: 'PUT', body: JSON.stringify(announcementData) }),
  deleteAnnouncement: (courseId, announcementId) => 
    apiCall(`/courses/${courseId}/announcements/${announcementId}`, { method: 'DELETE' }),
  createLesson: (courseId, lessonData) => 
    apiCall(`/courses/${courseId}/lessons`, { method: 'POST', body: JSON.stringify(lessonData) }),
  updateLesson: (courseId, lessonId, lessonData) => 
    apiCall(`/courses/${courseId}/lessons/${lessonId}`, { method: 'PUT', body: JSON.stringify(lessonData) }),
  deleteLesson: (courseId, lessonId) => 
    apiCall(`/courses/${courseId}/lessons/${lessonId}`, { method: 'DELETE' }),
  createQuiz: (courseId, quizData) => 
    apiCall(`/courses/${courseId}/quizzes`, { method: 'POST', body: JSON.stringify(quizData) }),
  updateQuiz: (courseId, quizId, quizData) => 
    apiCall(`/courses/${courseId}/quizzes/${quizId}`, { method: 'PUT', body: JSON.stringify(quizData) }),
  deleteQuiz: (courseId, quizId) => 
    apiCall(`/courses/${courseId}/quizzes/${quizId}`, { method: 'DELETE' }),
  getLessons: (courseId) => apiCall(`/courses/${courseId}/lessons`),
  getStudentProgress: (courseId, studentId) => apiCall(`/courses/${courseId}/students/${studentId}/progress`),
  getStudent: (courseId, studentId) => apiCall(`/courses/${courseId}/students/${studentId}`),
};

// Assignment API calls
export const assignmentAPI = {
  getAssignments: () => apiCall('/assignments'),
  getAssignment: (id) => apiCall(`/assignments/${id}`),
  createAssignment: (assignmentData) => 
    apiCall('/assignments', { method: 'POST', body: JSON.stringify(assignmentData) }),
  updateAssignment: (id, assignmentData) => 
    apiCall(`/assignments/${id}`, { method: 'PUT', body: JSON.stringify(assignmentData) }),
  deleteAssignment: (id) => 
    apiCall(`/assignments/${id}`, { method: 'DELETE' }),
  getAssignmentSubmissions: (id) => apiCall(`/assignments/${id}/submissions`),
  gradeAssignment: (assignmentId, submissionId, gradeData) => 
    apiCall(`/assignments/${assignmentId}/submissions/${submissionId}/grade`, { method: 'PUT', body: JSON.stringify(gradeData) }),
};

// Quiz API calls
export const quizAPI = {
  getQuizzes: () => apiCall('/quizzes'),
  getQuiz: (id) => apiCall(`/quizzes/${id}`),
  createQuiz: (quizData) => 
    apiCall('/quizzes', { method: 'POST', body: JSON.stringify(quizData) }),
  updateQuiz: (id, quizData) => 
    apiCall(`/quizzes/${id}`, { method: 'PUT', body: JSON.stringify(quizData) }),
  deleteQuiz: (id) => 
    apiCall(`/quizzes/${id}`, { method: 'DELETE' }),
};

// Mentoring API calls
export const mentoringAPI = {
  getMentorships: () => apiCall('/mentoring'),
  getMentorship: (id) => apiCall(`/mentoring/${id}`),
  sendMessage: (mentorshipId, messageData) => 
    apiCall(`/mentoring/${mentorshipId}/messages`, { method: 'POST', body: JSON.stringify(messageData) }),
  getMentorRequests: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.course_id) searchParams.append('course_id', params.course_id);

    const queryString = searchParams.toString();
    return apiCall(`/mentoring/requests/all${queryString ? `?${queryString}` : ''}`);
  },
  createMentorRequest: (requestData) => 
    apiCall('/mentoring/requests', { method: 'POST', body: JSON.stringify(requestData) }),
  deleteMentorRequest: (requestId) => 
    apiCall(`/mentoring/requests/${requestId}`, { method: 'DELETE' }),
  acceptMentorRequest: (requestId, mentorNotes) => 
    apiCall(`/mentoring/requests/${requestId}/accept`, { method: 'PUT', body: JSON.stringify({ mentor_notes: mentorNotes }) }),
  getAvailableMentors: (courseId) => 
    apiCall(`/mentoring/mentors/${courseId}`),
  updateMentorshipStatus: (mentorshipId, statusData) => 
    apiCall(`/mentoring/${mentorshipId}/status`, { method: 'PUT', body: JSON.stringify(statusData) }),
  rateMentorship: (mentorshipId, ratingData) => 
    apiCall(`/mentoring/${mentorshipId}/rate`, { method: 'POST', body: JSON.stringify(ratingData) }),
  checkMentorEligibility: (courseId) => 
    apiCall(`/mentoring/mentors/check/${courseId}`),
};

// Chatbot API calls
export const chatbotAPI = {
  startConversation: (courseId) =>
    apiCall('/chatbot/start', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId || null }),
    }),
  sendMessage: (conversationId, message) =>
    apiCall('/chatbot/message', {
      method: 'POST',
      body: JSON.stringify({ conversation_id: conversationId, message }),
    }),
  getConversations: () => apiCall('/chatbot/conversations'),
  getConversation: (conversationId) => apiCall(`/chatbot/conversations/${conversationId}`),
  deleteConversation: (conversationId) =>
    apiCall(`/chatbot/conversations/${conversationId}`, { method: 'DELETE' }),
};

// Analytics API calls
export const analyticsAPI = {
  getCourseAnalytics: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiCall(`/analytics/courses?${searchParams.toString()}`);
  },
  getStudentPerformance: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiCall(`/analytics/students?${searchParams.toString()}`);
  },
  getAssignmentAnalytics: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiCall(`/analytics/assignments?${searchParams.toString()}`);
  },
  getAIPredictions: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiCall(`/analytics/ai-predictions?${searchParams.toString()}`);
  },
};

// Reports API calls
export const reportsAPI = {
  getSystemStats: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiCall(`/reports/system?${searchParams.toString()}`);
  },
  getUserStats: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiCall(`/reports/users?${searchParams.toString()}`);
  },
  getCourseStats: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiCall(`/reports/courses?${searchParams.toString()}`);
  },
  getEnrollmentStats: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiCall(`/reports/enrollments?${searchParams.toString()}`);
  },
};

export default {
  calendar: calendarAPI,
  grades: gradesAPI,
  messages: messagesAPI,
  settings: settingsAPI,
  help: helpAPI,
  mentoring: mentoringAPI,
  auth: authAPI,
  user: userAPI,
  course: courseAPI,
  assignment: assignmentAPI,
  quiz: quizAPI,
  chatbot: chatbotAPI,
  analytics: analyticsAPI,
  reports: reportsAPI,
};