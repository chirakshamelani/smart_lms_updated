import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Clock, CheckCircle, Edit, Trash2, Plus, X, FileText } from 'lucide-react';

const Quizzes = ({
  course,
  isStudentNotEnrolled,
  isTeacherOrAdmin,
  isCourseCreatorOrAdmin,
  user,
}) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [quizzes, setQuizzes] = useState(course.quizzes || []);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    course_id: course.id,
    time_limit_minutes: 0,
    pass_percentage: 0,
    max_attempts: 1,
    questions: [],
  });
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [error, setError] = useState(null);

  const updateQuestion = (qIndex, field, value) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[qIndex][field] = value;
    if (field === 'question_type') {
      updatedQuestions[qIndex].options = value.toLowerCase() === 'true_false'
        ? [{ text: 'True', feedback: '' }, { text: 'False', feedback: '' }]
        : value.toLowerCase() === 'short_answer'
        ? []
        : [{ text: '', feedback: '' }, { text: '', feedback: '' }, { text: '', feedback: '' }, { text: '', feedback: '' }];
      updatedQuestions[qIndex].correct_answer = value.toLowerCase() === 'short_answer' ? '' : 0;
    }
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const updateOption = (qIndex, oIndex, field, value) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[qIndex].options[oIndex] = {
      ...updatedQuestions[qIndex].options[oIndex],
      [field]: value,
    };
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [
        ...newQuiz.questions,
        {
          question_text: '',
          question_type: 'multiple_choice',
          points: 1,
          feedback: '',
          options: [
            { text: '', feedback: '' },
            { text: '', feedback: '' },
            { text: '', feedback: '' },
            { text: '', feedback: '' },
          ],
          correct_answer: 0,
        },
      ],
    });
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[qIndex].options.push({ text: '', feedback: '' });
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const removeOption = (qIndex, oIndex) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_, i) => i !== oIndex);
    if (updatedQuestions[qIndex].correct_answer >= updatedQuestions[qIndex].options.length) {
      updatedQuestions[qIndex].correct_answer = 0;
    }
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const removeQuestion = (qIndex) => {
    const updatedQuestions = newQuiz.questions.filter((_, index) => index !== qIndex);
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  const handleCancel = () => {
    setShowQuizForm(false);
    setEditingQuizId(null);
    setError(null);
    setNewQuiz({
      title: '',
      description: '',
      course_id: course.id,
      time_limit_minutes: 0,
      pass_percentage: 0,
      max_attempts: 1,
      questions: [],
    });
  };

  const validateForm = () => {
    const { title, questions } = newQuiz;

    if (!title.trim()) {
      setError('Quiz title is required.');
      return false;
    }

    if (questions.length === 0) {
      setError('At least one question is required.');
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        setError(`Question ${i + 1} text is required.`);
        return false;
      }
      if (!q.question_type) {
        setError(`Question ${i + 1} type is required.`);
        return false;
      }
      if (!q.points || q.points < 1) {
        setError(`Question ${i + 1} must have points (minimum 1).`);
        return false;
      }
      const questionType = q.question_type.toLowerCase();
      if (!['multiple_choice', 'true_false', 'short_answer'].includes(questionType)) {
        setError(`Question ${i + 1} has an invalid question type.`);
        return false;
      }
      if (questionType === 'multiple_choice') {
        if (!Array.isArray(q.options) || q.options.length < 2) {
          setError(`Question ${i + 1} must have at least 2 options.`);
          return false;
        }
        if (q.options.some((opt) => !opt.text.trim())) {
          setError(`All options for Question ${i + 1} must be non-empty.`);
          return false;
        }
        if (q.correct_answer == null || q.correct_answer >= q.options.length) {
          setError(`Question ${i + 1} must have a valid correct answer.`);
          return false;
        }
      } else if (questionType === 'true_false') {
        if (!Array.isArray(q.options) || q.options.length !== 2) {
          setError(`Question ${i + 1} must have exactly 2 options (True, False).`);
          return false;
        }
        const optionTexts = q.options.map((opt) => opt.text.toLowerCase());
        if (!optionTexts.includes('true') || !optionTexts.includes('false')) {
          setError(`Question ${i + 1} must have options "True" and "False".`);
          return false;
        }
        if (q.correct_answer == null || q.correct_answer > 1) {
          setError(`Question ${i + 1} must have a valid correct answer.`);
          return false;
        }
      } else if (questionType === 'short_answer') {
        if (!q.correct_answer.trim()) {
          setError(`Question ${i + 1} must have a non-empty correct answer.`);
          return false;
        }
      }
    }

    return true;
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setError(null);
      const response = await fetch(`${apiUrl}/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newQuiz),
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const result = JSON.parse(text);
          throw new Error(result.error || 'Failed to create quiz');
        } catch {
          throw new Error(text || 'Failed to create quiz');
        }
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to create quiz');
      }

      setQuizzes([...quizzes, result.data]);
      handleCancel();
      alert('Quiz created successfully!');
    } catch (error) {
      console.error('Error creating quiz:', error);
      setError(error.message || 'Failed to create quiz');
    }
  };

  const handleUpdateQuiz = async (e, quizId) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setError(null);
      const response = await fetch(`${apiUrl}/quizzes/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newQuiz),
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const result = JSON.parse(text);
          throw new Error(result.error || 'Failed to update quiz');
        } catch {
          throw new Error(text || 'Failed to update quiz');
        }
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to update quiz');
      }

      setQuizzes(quizzes.map((q) => (q.id === quizId ? result.data : q)));
      handleCancel();
      alert('Quiz updated successfully!');
    } catch (error) {
      console.error('Error updating quiz:', error);
      setError(error.message || 'Failed to update quiz');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;

    try {
      setError(null);
      const response = await fetch(`${apiUrl}/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const result = JSON.parse(text);
          throw new Error(result.error || 'Failed to delete quiz');
        } catch {
          throw new Error(text || 'Failed to delete quiz');
        }
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete quiz');
      }

      setQuizzes(quizzes.filter((q) => q.id !== quizId));
      alert('Quiz deleted successfully!');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      setError(error.message || 'Failed to delete quiz');
    }
  };

  const handleEditQuiz = async (quiz) => {
    try {
      setError(null);
      setShowQuizForm(true);
      setEditingQuizId(quiz.id);

      const response = await fetch(`${apiUrl}/quizzes/${quiz.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const result = JSON.parse(text);
          throw new Error(result.error || 'Failed to fetch quiz details');
        } catch {
          throw new Error(text || 'Failed to fetch quiz details');
        }
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch quiz details');
      }

      const quizData = result.data;
      const transformedQuestions = quizData.questions.map((question) => {
        const questionType = question.question_type.toLowerCase();
        let correct_answer;
        let options;
        let feedback = question.feedback || '';

        if (questionType === 'short_answer') {
          const correctOpt = question.options.find((opt) => opt.is_correct) || { text: '', feedback: '' };
          correct_answer = correctOpt.text;
          options = [];
          feedback = correctOpt.feedback || feedback;
        } else {
          options = question.options.map((opt) => ({
            text: opt.text,
            feedback: opt.feedback || '',
          }));
          correct_answer = question.options.findIndex((opt) => opt.is_correct);
          if (correct_answer < 0) correct_answer = 0;
        }

        return {
          ...question,
          correct_answer,
          options,
          feedback,
        };
      });

      setNewQuiz({
        title: quizData.title || '',
        description: quizData.description || '',
        course_id: quizData.course_id,
        time_limit_minutes: quizData.time_limit_minutes || 0,
        pass_percentage: quizData.pass_percentage || 0,
        max_attempts: quizData.max_attempts || 1,
        questions: transformedQuestions,
      });
    } catch (error) {
      console.error('Error fetching quiz for edit:', error);
      setError(error.message || 'Failed to load quiz details for editing');
    }
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setError(null);
        const response = await fetch(`${apiUrl}/quizzes?course_id=${course.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          try {
            const result = JSON.parse(text);
            throw new Error(result.error || 'Failed to fetch quizzes');
          } catch {
            throw new Error(text || 'Failed to fetch quizzes');
          }
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch quizzes');
        }

        setQuizzes(result.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError(error.message || 'Failed to load quizzes');
      }
    };

    fetchQuizzes();
  }, [apiUrl, course.id]);

  return (
    <div className="fade-in">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Course Quizzes</h5>
          {error && <div className="alert alert-danger">{error}</div>}
          {isTeacherOrAdmin && isCourseCreatorOrAdmin && user?.role && (
            <button
              className="btn btn-primary mb-4"
              onClick={() => {
                setShowQuizForm(true);
                setEditingQuizId(null);
                setNewQuiz({
                  title: '',
                  description: '',
                  course_id: course.id,
                  time_limit_minutes: 0,
                  pass_percentage: 0,
                  max_attempts: 1,
                  questions: [],
                });
                setError(null);
              }}
              aria-label="Add new quiz"
            >
              <Plus size={16} className="me-1" /> Add New Quiz
            </button>
          )}
          {showQuizForm && isTeacherOrAdmin && isCourseCreatorOrAdmin && user?.role && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h6 className="mb-3">{editingQuizId ? 'Edit Quiz' : 'Add New Quiz'}</h6>
                <form onSubmit={editingQuizId ? (e) => handleUpdateQuiz(e, editingQuizId) : handleCreateQuiz}>
                  <div className="mb-3">
                    <label htmlFor="quizTitle" className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="quizTitle"
                      value={newQuiz.title}
                      onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                      required
                      aria-label="Quiz title"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quizDescription" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="quizDescription"
                      value={newQuiz.description}
                      onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                      rows={4}
                      aria-label="Quiz description"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quizTimeLimit" className="form-label">Time Limit (minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="quizTimeLimit"
                      value={newQuiz.time_limit_minutes}
                      onChange={(e) => setNewQuiz({ ...newQuiz, time_limit_minutes: parseInt(e.target.value) || 0 })}
                      min={0}
                      required
                      aria-label="Quiz time limit"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quizPassPercentage" className="form-label">Pass Percentage</label>
                    <input
                      type="number"
                      className="form-control"
                      id="quizPassPercentage"
                      value={newQuiz.pass_percentage}
                      onChange={(e) => setNewQuiz({ ...newQuiz, pass_percentage: parseInt(e.target.value) || 0 })}
                      min={0}
                      max={100}
                      required
                      aria-label="Quiz pass percentage"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quizMaxAttempts" className="form-label">Max Attempts</label>
                    <input
                      type="number"
                      className="form-control"
                      id="quizMaxAttempts"
                      value={newQuiz.max_attempts}
                      onChange={(e) => setNewQuiz({ ...newQuiz, max_attempts: parseInt(e.target.value) || 1 })}
                      min={1}
                      required
                      aria-label="Quiz max attempts"
                    />
                  </div>
                  <div className="mb-3">
                    <h6 className="mb-2">Questions</h6>
                    {newQuiz.questions.length > 0 ? (
                      newQuiz.questions.map((question, qIndex) => (
                        <div key={qIndex} className="card mb-2">
                          <div className="card-body">
                            <div className="mb-2">
                              <label htmlFor={`questionType${qIndex}`} className="form-label">Question Type</label>
                              <select
                                className="form-control"
                                id={`questionType${qIndex}`}
                                value={question.question_type || 'multiple_choice'}
                                onChange={(e) => updateQuestion(qIndex, 'question_type', e.target.value)}
                                aria-label={`Question ${qIndex + 1} type`}
                              >
                                <option value="multiple_choice">Multiple Choice</option>
                                <option value="true_false">True/False</option>
                                <option value="short_answer">Short Answer</option>
                              </select>
                            </div>
                            <input
                              type="text"
                              className="form-control mb-2"
                              placeholder="Question text"
                              value={question.question_text}
                              onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                              required
                              aria-label={`Question ${qIndex + 1} text`}
                            />
                            <div className="mb-2">
                              <label htmlFor={`questionPoints${qIndex}`} className="form-label">Points</label>
                              <input
                                type="number"
                                className="form-control"
                                id={`questionPoints${qIndex}`}
                                value={question.points}
                                onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 1)}
                                min={1}
                                required
                                aria-label={`Question ${qIndex + 1} points`}
                              />
                            </div>
                            <textarea
                              className="form-control mb-2"
                              placeholder="Feedback (optional)"
                              value={question.feedback}
                              onChange={(e) => updateQuestion(qIndex, 'feedback', e.target.value)}
                              rows={2}
                              aria-label={`Question ${qIndex + 1} feedback`}
                            />
                            {question.question_type.toLowerCase() !== 'short_answer' ? (
                              <>
                                <h6 className="mb-2">Options</h6>
                                {question.options.map((option, oIndex) => (
                                  <div key={oIndex} className="input-group mb-1">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder={`Option ${oIndex + 1}`}
                                      value={option.text}
                                      onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                                      required
                                      disabled={question.question_type.toLowerCase() === 'true_false'}
                                      aria-label={`Question ${qIndex + 1} option ${oIndex + 1}`}
                                    />
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Feedback (optional)"
                                      value={option.feedback}
                                      onChange={(e) => updateOption(qIndex, oIndex, 'feedback', e.target.value)}
                                      aria-label={`Question ${qIndex + 1} option ${oIndex + 1} feedback`}
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger"
                                      onClick={() => removeOption(qIndex, oIndex)}
                                      disabled={question.options.length <= 2 || question.question_type.toLowerCase() === 'true_false'}
                                      aria-label={`Remove option ${oIndex + 1} for question ${qIndex + 1}`}
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))}
                                {question.question_type.toLowerCase() !== 'true_false' && (
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm mt-2"
                                    onClick={() => addOption(qIndex)}
                                    aria-label={`Add option to question ${qIndex + 1}`}
                                  >
                                    <Plus size={14} className="me-1" /> Add Option
                                  </button>
                                )}
                                <select
                                  className="form-control mt-2 mb-2"
                                  value={question.correct_answer}
                                  onChange={(e) => updateQuestion(qIndex, 'correct_answer', parseInt(e.target.value))}
                                  aria-label={`Select correct answer for question ${qIndex + 1}`}
                                >
                                  {question.options.map((opt, i) => (
                                    <option key={i} value={i} disabled={!opt.text.trim()}>
                                      Option {i + 1}{opt.text.trim() ? `: ${opt.text}` : ''}
                                    </option>
                                  ))}
                                </select>
                              </>
                            ) : (
                              <div className="mb-2">
                                <label htmlFor={`correctAnswer${qIndex}`} className="form-label">Correct Answer</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id={`correctAnswer${qIndex}`}
                                  value={question.correct_answer}
                                  onChange={(e) => updateQuestion(qIndex, 'correct_answer', e.target.value)}
                                  required
                                  aria-label={`Question ${qIndex + 1} correct answer`}
                                />
                              </div>
                            )}
                            <button
                              type="button"
                              className="btn btn-danger btn-sm mt-2"
                              onClick={() => removeQuestion(qIndex)}
                              aria-label={`Remove question ${qIndex + 1}`}
                            >
                              <X size={14} className="me-1" /> Remove Question
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No questions added yet.</p>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-primary mt-2"
                      onClick={addQuestion}
                      aria-label="Add new question"
                    >
                      <Plus size={16} className="me-1" /> Add Question
                    </button>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      aria-label={editingQuizId ? 'Update quiz' : 'Add quiz'}
                    >
                      {editingQuizId ? 'Update Quiz' : 'Add Quiz'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCancel}
                      aria-label="Cancel quiz form"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {quizzes && quizzes.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {quizzes.map((quiz) => (
                <div className="col" key={quiz.id}>
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                          <Award className="text-primary" size={20} />
                        </div>
                        <h5 className="card-title mb-0">{quiz.title}</h5>
                      </div>
                      <p className="card-text small">{quiz.description}</p>
                      <ul className="list-unstyled small text-muted mb-4">
                        <li className="d-flex align-items-center mb-2">
                          <Clock size={14} className="me-2" /> Time Limit: {quiz.time_limit_minutes} minutes
                        </li>
                        <li className="d-flex align-items-center mb-2">
                          <Award size={14} className="me-2" /> Pass Percentage: {quiz.pass_percentage}%
                        </li>
                        <li className="d-flex align-items-center mb-2">
                          <CheckCircle size={14} className="me-2" /> Attempts: {quiz.attempts || 0}/{quiz.max_attempts}
                        </li>
                        <li className="d-flex align-items-center">
                          <FileText size={14} className="me-2" /> Questions: {quiz.question_count || 0}
                        </li>
                      </ul>
                      {isTeacherOrAdmin && isCourseCreatorOrAdmin && user?.role && (
                        <div className="d-flex gap-2 mb-3">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleEditQuiz(quiz)}
                            aria-label={`Edit quiz ${quiz.title}`}
                          >
                            <Edit size={14} className="me-1" /> Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            aria-label={`Delete quiz ${quiz.title}`}
                          >
                            <Trash2 size={14} className="me-1" /> Delete
                          </button>
                        </div>
                      )}
                      <Link
                        to={`/courses/${course.id}/quizzes/${quiz.id}`}
                        className={`btn btn-outline-primary w-100 ${isStudentNotEnrolled || quiz.attempts >= quiz.max_attempts ? 'disabled' : ''}`}
                        aria-label={`Start quiz ${quiz.title}`}
                      >
                        {quiz.attempts >= quiz.max_attempts ? 'Max Attempts Reached' : 'Start Quiz'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <Award size={48} className="text-muted mb-3" />
              <h5>No quizzes available yet</h5>
              <p className="text-muted">The instructor hasn't added any quizzes to this course yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;