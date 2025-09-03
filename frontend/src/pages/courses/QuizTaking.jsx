import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Award, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const QuizTaking = ({ user }) => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setError(null);
        const response = await fetch(`${apiUrl}/quizzes/${quizId}?course_id=${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          try {
            const result = JSON.parse(text);
            throw new Error(result.error || 'Failed to fetch quiz');
          } catch {
            throw new Error(text || 'Failed to fetch quiz');
          }
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch quiz');
        }

        if (result.data.course_id !== parseInt(courseId)) {
          throw new Error('Quiz does not belong to this course');
        }

        setQuiz(result.data);
        setTimeLeft(result.data.time_limit_minutes * 60);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError(error.message || 'Failed to load quiz');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, courseId, apiUrl]);

  useEffect(() => {
    if (!hasStarted || timeLeft === null || timeLeft <= 0 || result) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, timeLeft, result]);

  const handleStartQuiz = () => {
    setHasStarted(true);
  };

  const handleAnswerChange = (questionId, value, answerId = null) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { question_id: questionId, answer: value, answer_id: answerId },
    }));
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      const response = await fetch(`${apiUrl}/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ answers: Object.values(answers), course_id: courseId }),
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const result = JSON.parse(text);
          throw new Error(result.error || 'Failed to submit quiz');
        } catch {
          throw new Error(text || 'Failed to submit quiz');
        }
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit quiz');
      }

      setResult(result.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError(error.message || 'Failed to submit quiz');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return <div className="text-center py-5">Loading quiz...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center">
        <AlertCircle size={20} className="me-2" /> {error}
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center">
          <p className="text-muted">Quiz data not available.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/courses/${courseId}`)}
            aria-label="Back to course"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">{quiz.title}</h5>
          {quiz.description && <p className="mb-4">{quiz.description}</p>}
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <Clock size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-muted small">Time Limit</div>
                  <div>{quiz.time_limit_minutes} minutes</div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <Award size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-muted small">Pass Percentage</div>
                  <div>{quiz.pass_percentage}%</div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <FileText size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-muted small">Questions</div>
                  <div>{quiz.question_count || quiz.questions.length} questions</div>
                </div>
              </div>
            </div>
          </div>
          <div className="alert alert-info d-flex align-items-center">
            <AlertCircle size={20} className="me-2" />
            <span>
              Once you start, you will have {quiz.time_limit_minutes} minutes to complete the quiz. You cannot pause or save progress.
            </span>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={handleStartQuiz}
              aria-label="Start quiz"
            >
              Start Quiz
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate(`/courses/${courseId}`)}
              aria-label="Back to course"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Quiz Results</h5>
          <div className="alert alert-success d-flex align-items-center mb-4">
            <CheckCircle size={20} className="me-2" />
            <div>
              Score: {result.score} / {result.total_points} ({result.percentage}%)<br />
              Status: {result.passed ? 'Passed' : 'Failed'}
            </div>
          </div>
          <h6 className="mt-4">Detailed Results</h6>
          {result.results.map((res, index) => (
            <div key={index} className="mb-3 p-3 bg-light rounded">
              <p className="mb-1">
                <strong>Question {index + 1}:</strong>{' '}
                {quiz.questions.find((q) => q.id === res.question_id)?.question_text}
              </p>
              <p className="mb-1">
                Your Answer: {res.selected_answer} ({res.is_correct ? 'Correct' : 'Incorrect'})
              </p>
              <p className="mb-0">Feedback: {res.feedback || 'No feedback provided'}</p>
            </div>
          ))}
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/courses/${courseId}`)}
            aria-label="Back to course"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  if (quiz.questions.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center">
          <p className="text-muted">No questions available for this quiz.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/courses/${courseId}`)}
            aria-label="Back to course"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title">{quiz.title}</h5>
          <div className="d-flex align-items-center bg-primary bg-opacity-10 rounded p-2">
            <Clock size={20} className="text-primary me-2" />
            <span className={timeLeft <= 60 ? 'text-danger' : ''}>
              Time Left: {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <div className="mb-4">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="mb-3">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}: {currentQuestion.question_text} ({currentQuestion.points} points)
                  </h6>
                  {currentQuestion.question_type.toLowerCase() === 'short_answer' ? (
                    <textarea
                      className="form-control"
                      value={answers[currentQuestion.id]?.answer || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      rows={4}
                      placeholder="Enter your answer"
                      aria-label={`Answer for question ${currentQuestionIndex + 1}`}
                    />
                  ) : (
                    <div>
                      {currentQuestion.options.map((option) => (
                        <div key={option.id} className="form-check mb-2">
                          <input
                            type="radio"
                            className="form-check-input"
                            name={`question-${currentQuestion.id}`}
                            id={`option-${option.id}`}
                            value={option.text}
                            checked={answers[currentQuestion.id]?.answer_id === option.id}
                            onChange={() => handleAnswerChange(currentQuestion.id, option.text, option.id)}
                            aria-label={`Option ${option.text} for question ${currentQuestionIndex + 1}`}
                          />
                          <label className="form-check-label" htmlFor={`option-${option.id}`}>
                            {option.text}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="mb-3">Question Navigation</h6>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {quiz.questions.map((_, index) => (
                      <button
                        key={index}
                        className={`btn btn-sm ${
                          index === currentQuestionIndex
                            ? 'btn-primary'
                            : answers[quiz.questions[index].id]
                            ? 'btn-success'
                            : 'btn-outline-secondary'
                        }`}
                        onClick={() => handleQuestionSelect(index)}
                        aria-label={`Go to question ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      aria-label="Previous question"
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === quiz.questions.length - 1}
                      aria-label="Next question"
                    >
                      Next
                    </button>
                  </div>
                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length < quiz.questions.length || timeLeft <= 0}
                    aria-label="Submit quiz"
                  >
                    Submit Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;