import { db } from '../database/db.js';

// Get all quizzes for a course
export const getQuizzes = async (req, res) => {
  try {
    const { course_id } = req.query;

    let query = db('quizzes')
      .join('courses', 'quizzes.course_id', '=', 'courses.id')
      .join('users', 'quizzes.created_by', '=', 'users.id')
      .select(
        'quizzes.id',
        'quizzes.title',
        'quizzes.description',
        'quizzes.course_id',
        'quizzes.time_limit_minutes',
        'quizzes.pass_percentage',
        'quizzes.max_attempts',
        'quizzes.created_at',
        'quizzes.updated_at',
        'users.first_name as creator_first_name',
        'users.last_name as creator_last_name',
        db.raw('(SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = quizzes.id) as question_count')
      );

    if (course_id) {
      query = query.where('quizzes.course_id', course_id);
    }

    if (req.user.role === 'student') {
      query = query
        .join('enrollments', 'courses.id', '=', 'enrollments.course_id')
        .where('enrollments.user_id', req.user.id)
        .andWhere('courses.status', 'published');
    }

    if (req.user.role === 'teacher') {
      query = query.where('quizzes.created_by', req.user.id);
    }

    const quizzes = await query;

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    console.error('Error in getQuizzes:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Get single quiz
export const getQuiz = async (req, res) => {
  try {
    console.log('User making request:', { id: req.user.id, role: req.user.role });

    const quiz = await db('quizzes')
      .join('courses', 'quizzes.course_id', '=', 'courses.id')
      .join('users', 'quizzes.created_by', '=', 'users.id')
      .where('quizzes.id', req.params.id)
      .select(
        'quizzes.id',
        'quizzes.title',
        'quizzes.description',
        'quizzes.course_id',
        'quizzes.time_limit_minutes',
        'quizzes.pass_percentage',
        'quizzes.max_attempts',
        'quizzes.created_at',
        'quizzes.updated_at',
        'users.id as creator_id',
        'users.first_name as creator_first_name',
        'users.last_name as creator_last_name'
      )
      .first();

    if (!quiz) {
      console.log(`Quiz not found for ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
      });
    }

    if (req.user.role === 'student') {
      const enrollment = await db('enrollments')
        .where({
          user_id: req.user.id,
          course_id: quiz.course_id,
        })
        .first();

      const course = await db('courses').where('id', quiz.course_id).first();
      console.log('Student authorization check:', {
        user_id: req.user.id,
        course_id: quiz.course_id,
        enrollment_exists: !!enrollment,
        course_status: course?.status
      });

      if (!enrollment || course.status !== 'published') {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to view this quiz',
        });
      }
    }

    if (req.user.role === 'teacher' && quiz.creator_id !== req.user.id) {
      console.log('Teacher authorization check failed:', {
        user_id: req.user.id,
        quiz_creator_id: quiz.creator_id
      });
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this quiz',
      });
    }

    // Get quiz questions
    const questions = await db('quiz_questions')
      .where('quiz_id', req.params.id)
      .orderBy('order', 'asc');

    // Fetch options for multiple_choice and true_false questions
    for (const question of questions) {
      const questionType = question.question_type.toLowerCase();
      const answers = await db('quiz_answers')
        .where('question_id', question.id)
        .select('answer_text', 'is_correct', 'feedback')
        .orderBy('id', 'asc');
      question.options = answers.map(a => ({
        text: a.answer_text,
        is_correct: a.is_correct,
        feedback: a.feedback || ''
      }));
      if (!question.options.length) {
        console.warn(`No answers found for question ID ${question.id}`);
        question.options = [];
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...quiz,
        questions,
      },
    });
  } catch (error) {
    console.error('Error in getQuiz:', error);
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      res.status(500).json({
        success: false,
        error: 'Database schema error: Missing column in table',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server error',
      });
    }
  }
};

// Create quiz
export const createQuiz = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to create quizzes',
      });
    }

    const { title, description, course_id, time_limit_minutes, pass_percentage, max_attempts, questions } = req.body;

    // Validate input
    if (!title || !course_id || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, course_id, or questions',
      });
    }

    // Validate questions
    for (const q of questions) {
      if (!q.question_text || !q.question_type || !q.points) {
        return res.status(400).json({
          success: false,
          error: 'Each question must have text, type, and points',
        });
      }
      const questionType = q.question_type.toLowerCase();
      if (!['multiple_choice', 'true_false', 'short_answer'].includes(questionType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid question type. Must be multiple_choice, true_false, or short_answer',
        });
      }
      if (questionType === 'multiple_choice') {
        if (!Array.isArray(q.options) || q.options.length < 2 || q.correct_answer == null || q.correct_answer < 0 || q.correct_answer >= q.options.length) {
          return res.status(400).json({
            success: false,
            error: 'Multiple choice questions must have at least 2 options and a valid correct answer index',
          });
        }
        if (q.options.some(opt => !opt.text || typeof opt.text !== 'string')) {
          return res.status(400).json({
            success: false,
            error: 'All multiple choice options must be non-empty strings',
          });
        }
      } else if (questionType === 'true_false') {
        if (!Array.isArray(q.options) || q.options.length !== 2 || q.correct_answer == null || q.correct_answer < 0 || q.correct_answer > 1) {
          return res.status(400).json({
            success: false,
            error: 'True/false questions must have exactly 2 options (True, False) and a valid correct answer index',
          });
        }
        const optionTexts = q.options.map(opt => opt.text.toLowerCase());
        if (!optionTexts.includes('true') || !optionTexts.includes('false')) {
          return res.status(400).json({
            success: false,
            error: 'True/false questions must have options "True" and "False"',
          });
        }
      } else if (questionType === 'short_answer') {
        if (!q.correct_answer || typeof q.correct_answer !== 'string') {
          return res.status(400).json({
            success: false,
            error: 'Short answer questions must have a non-empty correct answer string',
          });
        }
      }
    }

    // Verify course exists and user is authorized
    const course = await db('courses').where('id', course_id).first();
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }
    if (req.user.role === 'teacher' && course.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to create quizzes for this course',
      });
    }

    const [quizId] = await db('quizzes').insert({
      title,
      description,
      course_id,
      time_limit_minutes,
      pass_percentage,
      max_attempts,
      created_by: req.user.id,
    });

    // Insert questions and answers
    if (questions && questions.length > 0) {
      const questionIds = [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const [questionId] = await db('quiz_questions').insert({
          quiz_id: quizId,
          question_text: q.question_text,
          question_type: q.question_type.toLowerCase(),
          points: q.points,
          feedback: q.feedback || '',
          order: i + 1,
        });
        questionIds.push(questionId);
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const questionType = q.question_type.toLowerCase();
        let answerData = [];

        if (questionType === 'multiple_choice') {
          answerData = q.options.map((opt, optIndex) => ({
            question_id: questionIds[i],
            answer_text: opt.text,
            is_correct: optIndex === q.correct_answer,
            feedback: opt.feedback || '',
            created_at: new Date(),
            updated_at: new Date(),
          }));
        } else if (questionType === 'true_false') {
          answerData = q.options.map((opt, optIndex) => ({
            question_id: questionIds[i],
            answer_text: opt.text,
            is_correct: optIndex === q.correct_answer,
            feedback: opt.feedback || '',
            created_at: new Date(),
            updated_at: new Date(),
          }));
        } else if (questionType === 'short_answer') {
          answerData = [{
            question_id: questionIds[i],
            answer_text: q.correct_answer,
            is_correct: true,
            feedback: q.feedback || '',
            created_at: new Date(),
            updated_at: new Date(),
          }];
        }

        if (answerData.length > 0) {
          await db('quiz_answers').insert(answerData);
        }
      }
    }

    const quiz = await db('quizzes').where('id', quizId).first();

    res.status(201).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error('Error in createQuiz:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Update quiz
export const updateQuiz = async (req, res) => {
  try {
    const quiz = await db('quizzes').where('id', req.params.id).first();
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
      });
    }

    if (req.user.role !== 'admin' && quiz.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this quiz',
      });
    }

    const { title, description, time_limit_minutes, pass_percentage, max_attempts, questions } = req.body;

    // Validate input
    if (!title || questions && !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title or questions',
      });
    }

    // Validate questions
    if (questions && questions.length > 0) {
      for (const q of questions) {
        if (!q.question_text || !q.question_type || !q.points) {
          return res.status(400).json({
            success: false,
            error: 'Each question must have text, type, and points',
          });
        }
        const questionType = q.question_type.toLowerCase();
        if (!['multiple_choice', 'true_false', 'short_answer'].includes(questionType)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid question type. Must be multiple_choice, true_false, or short_answer',
          });
        }
        if (questionType === 'multiple_choice') {
          if (!Array.isArray(q.options) || q.options.length < 2 || q.correct_answer == null || q.correct_answer < 0 || q.correct_answer >= q.options.length) {
            return res.status(400).json({
              success: false,
              error: 'Multiple choice questions must have at least 2 options and a valid correct answer index',
            });
          }
          if (q.options.some(opt => !opt.text || typeof opt.text !== 'string')) {
            return res.status(400).json({
              success: false,
              error: 'All multiple choice options must be non-empty strings',
            });
          }
        } else if (questionType === 'true_false') {
          if (!Array.isArray(q.options) || q.options.length !== 2 || q.correct_answer == null || q.correct_answer < 0 || q.correct_answer > 1) {
            return res.status(400).json({
              success: false,
              error: 'True/false questions must have exactly 2 options (True, False) and a valid correct answer index',
            });
          }
          const optionTexts = q.options.map(opt => opt.text.toLowerCase());
          if (!optionTexts.includes('true') || !optionTexts.includes('false')) {
            return res.status(400).json({
              success: false,
              error: 'True/false questions must have options "True" and "False"',
            });
          }
        } else if (questionType === 'short_answer') {
          if (!q.correct_answer || typeof q.correct_answer !== 'string') {
            return res.status(400).json({
              success: false,
              error: 'Short answer questions must have a non-empty correct answer string',
            });
          }
        }
      }
    }

    await db('quizzes').where('id', req.params.id).update({
      title,
      description,
      time_limit_minutes,
      pass_percentage,
      max_attempts,
    });

    // Update questions and answers
    if (questions && questions.length > 0) {
      await db('quiz_questions').where('quiz_id', req.params.id).del();
      await db('quiz_answers').whereIn('question_id', db('quiz_questions').select('id').where('quiz_id', req.params.id)).del();

      const questionIds = [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const [questionId] = await db('quiz_questions').insert({
          quiz_id: req.params.id,
          question_text: q.question_text,
          question_type: q.question_type.toLowerCase(),
          points: q.points,
          feedback: q.feedback || '',
          order: i + 1,
        });
        questionIds.push(questionId);
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const questionType = q.question_type.toLowerCase();
        const answerData = [];

        if (questionType === 'multiple_choice') {
          answerData.push(...q.options.map((opt, optIndex) => ({
            question_id: questionIds[i],
            answer_text: opt.text,
            is_correct: optIndex === q.correct_answer,
            feedback: opt.feedback || '',
            created_at: new Date(),
            updated_at: new Date(),
          })));
        } else if (questionType === 'true_false') {
          answerData.push(...q.options.map((opt, optIndex) => ({
            question_id: questionIds[i],
            answer_text: opt.text,
            is_correct: optIndex === q.correct_answer,
            feedback: opt.feedback || '',
            created_at: new Date(),
            updated_at: new Date(),
          })));
        } else if (questionType === 'short_answer') {
          answerData.push({
            question_id: questionIds[i],
            answer_text: q.correct_answer,
            is_correct: true,
            feedback: q.feedback || '',
            created_at: new Date(),
            updated_at: new Date(),
          });
        }

        if (answerData.length > 0) {
          await db('quiz_answers').insert(answerData);
        }
      }
    }

    const updatedQuiz = await db('quizzes').where('id', req.params.id).first();

    res.status(200).json({
      success: true,
      data: updatedQuiz,
    });
  } catch (error) {
    console.error('Error in updateQuiz:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Delete quiz
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await db('quizzes').where('id', req.params.id).first();
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
      });
    }

    if (req.user.role !== 'admin' && quiz.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this quiz',
      });
    }

    await db('quizzes').where('id', req.params.id).del();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteQuiz:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Submit quiz response
export const submitQuiz = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        error: 'Only students can submit quizzes',
      });
    }

    const quiz = await db('quizzes').where('id', req.params.id).first();
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
      });
    }

    const course = await db('courses').where('id', quiz.course_id).first();
    if (course.status !== 'published') {
      return res.status(403).json({
        success: false,
        error: 'Cannot submit quiz for unpublished course',
      });
    }

    const enrollment = await db('enrollments')
      .where({
        user_id: req.user.id,
        course_id: quiz.course_id,
      })
      .first();
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        error: 'Not enrolled in this course',
      });
    }

    const attemptCount = await db('quiz_submissions')
      .where({
        quiz_id: req.params.id,
        user_id: req.user.id
      })
      .count('id as count')
      .first();

    if (attemptCount.count >= quiz.max_attempts) {
      return res.status(403).json({
        success: false,
        error: 'Maximum attempts reached'
      });
    }

    const { answers } = req.body;

    const questions = await db('quiz_questions').where('quiz_id', req.params.id);
    let score = 0;
    const totalQuestions = questions.length;

    const results = await Promise.all(answers.map(async (ans) => {
      const question = questions.find((q) => q.id === ans.question_id);
      const questionType = question.question_type.toLowerCase();
      let isCorrect = false;
      let feedback = '';

      if (['multiple_choice', 'true_false'].includes(questionType)) {
        const answer = await db('quiz_answers')
          .where({ question_id: ans.question_id, answer_text: ans.answer })
          .first();
        isCorrect = answer && answer.is_correct;
        feedback = answer ? answer.feedback : question.feedback || '';
      } else if (questionType === 'short_answer') {
        const correctAnswer = await db('quiz_answers')
          .where({ question_id: ans.question_id, is_correct: true })
          .first();
        isCorrect = correctAnswer && ans.answer.trim().toLowerCase() === correctAnswer.answer_text.trim().toLowerCase();
        feedback = correctAnswer ? correctAnswer.feedback : question.feedback || '';
      }

      if (isCorrect) score += question.points;

      return {
        question_id: ans.question_id,
        selected_answer: ans.answer,
        is_correct: isCorrect,
        feedback,
      };
    }));

    await db('quiz_submissions').insert({
      quiz_id: req.params.id,
      user_id: req.user.id,
      score,
      total_questions: totalQuestions,
      submission_date: new Date(),
      answers: JSON.stringify(answers),
    });

    res.status(200).json({
      success: true,
      data: {
        score,
        total_questions: totalQuestions,
        results,
      },
    });
  } catch (error) {
    console.error('Error in submitQuiz:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Get quiz submissions (for teachers/admins)
export const getQuizSubmissions = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view quiz submissions',
      });
    }

    const quiz = await db('quizzes').where('id', req.params.id).first();
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
      });
    }

    if (req.user.role === 'teacher' && quiz.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view submissions for this quiz',
      });
    }

    const submissions = await db('quiz_submissions')
      .join('users', 'quiz_submissions.user_id', '=', 'users.id')
      .where('quiz_submissions.quiz_id', req.params.id)
      .select(
        'quiz_submissions.id',
        'quiz_submissions.score',
        'quiz_submissions.total_questions',
        'quiz_submissions.submission_date',
        'quiz_submissions.answers',
        'users.id as student_id',
        'users.first_name',
        'users.last_name',
        'users.email'
      );

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error('Error in getQuizSubmissions:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};