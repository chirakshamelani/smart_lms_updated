import { db } from '../database/db.js';

// Get all assignments for a course
export const getAssignments = async (req, res) => {
  try {
    const { course_id } = req.query;

    let query = db('assignments')
      .join('courses', 'assignments.course_id', '=', 'courses.id')
      .select(
        'assignments.id',
        'assignments.title',
        'assignments.description',
        'assignments.due_date',
        'assignments.course_id',
        'assignments.points',
        'assignments.is_published',
        'assignments.created_at',
        'assignments.updated_at',
        'courses.title as course_name'
      );

    if (course_id) {
      query = query.where('assignments.course_id', course_id);
    }

    if (req.user.role === 'student') {
      query = query
        .join('enrollments', 'courses.id', '=', 'enrollments.course_id')
        .where('enrollments.user_id', req.user.id)
        .andWhere('assignments.is_published', 1);
    }

    if (req.user.role === 'teacher') {
      query = query.where('courses.created_by', req.user.id);
    }

    const assignments = await query;

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    console.error('Error fetching assignments:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignments',
    });
  }
};

// Get single assignment
export const getAssignment = async (req, res) => {
  try {
    const assignment = await db('assignments')
      .join('courses', 'assignments.course_id', '=', 'courses.id')
      .where('assignments.id', req.params.id)
      .select(
        'assignments.id',
        'assignments.title',
        'assignments.description',
        'assignments.due_date',
        'assignments.course_id',
        'assignments.points',
        'assignments.is_published',
        'assignments.created_at',
        'assignments.updated_at',
        'courses.title as course_name'
      )
      .first();

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found',
      });
    }

    if (req.user.role === 'student') {
      const enrollment = await db('enrollments')
        .where({
          user_id: req.user.id,
          course_id: assignment.course_id,
        })
        .first();

      if (!enrollment || !assignment.is_published) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to view this assignment',
        });
      }
    }

    if (req.user.role === 'teacher') {
      const course = await db('courses').where('id', assignment.course_id).first();
      if (course.created_by !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to view this assignment',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error('Error fetching assignment:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignment',
    });
  }
};

// Create assignment
export const createAssignment = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to create assignments',
      });
    }

    const { title, description, due_date, course_id, points, is_published } = req.body;

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
        error: 'Not authorized to create assignments for this course',
      });
    }

    const [assignmentId] = await db('assignments').insert({
      title,
      description,
      due_date,
      course_id,
      points,
      is_published: is_published ? 1 : 0,
    });

    const assignment = await db('assignments')
      .join('courses', 'assignments.course_id', '=', 'courses.id')
      .where('assignments.id', assignmentId)
      .select(
        'assignments.id',
        'assignments.title',
        'assignments.description',
        'assignments.due_date',
        'assignments.course_id',
        'assignments.points',
        'assignments.is_published',
        'assignments.created_at',
        'assignments.updated_at',
        'courses.title as course_name'
      )
      .first();

    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error('Error creating assignment:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to create assignment',
    });
  }
};

// Update assignment
export const updateAssignment = async (req, res) => {
  try {
    const assignment = await db('assignments').where('id', req.params.id).first();
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found',
      });
    }

    const course = await db('courses').where('id', assignment.course_id).first();
    if (req.user.role === 'teacher' && course.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this assignment',
      });
    }

    const { title, description, due_date, points, is_published } = req.body;

    const updatedAssignment = await db('assignments')
      .where('id', req.params.id)
      .update(
        {
          title,
          description,
          due_date,
          points,
          is_published: is_published ? 1 : 0,
        },
        ['*']
      );

    const result = await db('assignments')
      .join('courses', 'assignments.course_id', '=', 'courses.id')
      .where('assignments.id', req.params.id)
      .select(
        'assignments.id',
        'assignments.title',
        'assignments.description',
        'assignments.due_date',
        'assignments.course_id',
        'assignments.points',
        'assignments.is_published',
        'assignments.created_at',
        'assignments.updated_at',
        'courses.title as course_name'
      )
      .first();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error updating assignment:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to update assignment',
    });
  }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await db('assignments').where('id', req.params.id).first();
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found',
      });
    }

    const course = await db('courses').where('id', assignment.course_id).first();
    if (req.user.role === 'teacher' && course.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this assignment',
      });
    }

    await db('assignments').where('id', req.params.id).del();

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting assignment:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to delete assignment',
    });
  }
};

// Submit assignment
export const submitAssignment = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        error: 'Only students can submit assignments',
      });
    }

    const assignment = await db('assignments').where('id', req.params.id).first();
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found',
      });
    }

    if (!assignment.is_published) {
      return res.status(403).json({
        success: false,
        error: 'Cannot submit unpublished assignment',
      });
    }

    const enrollment = await db('enrollments')
      .where({
        user_id: req.user.id,
        course_id: assignment.course_id,
      })
      .first();
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        error: 'Not enrolled in this course',
      });
    }

    const { submission_text, attachment_url } = req.body;

    const [submissionId] = await db('assignment_submissions').insert({
      assignment_id: req.params.id,
      user_id: req.user.id,
      submission_text,
      attachment_url,
      submitted_at: new Date(),
      status: new Date() > new Date(assignment.due_date) ? 'late' : 'submitted',
    });

    const submission = await db('assignment_submissions').where('id', submissionId).first();

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error('Error submitting assignment:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to submit assignment',
    });
  }
};

// Get assignment submissions (for teachers/admins)
export const getAssignmentSubmissions = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view assignment submissions',
      });
    }

    const assignment = await db('assignments').where('id', req.params.id).first();
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found',
      });
    }

    const course = await db('courses').where('id', assignment.course_id).first();
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found for this assignment',
      });
    }

    if (req.user.role === 'teacher' && course.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view submissions for this assignment',
      });
    }

    const submissions = await db('assignment_submissions')
      .leftJoin('users', 'assignment_submissions.user_id', '=', 'users.id') // Changed to leftJoin to handle missing users
      .where('assignment_submissions.assignment_id', req.params.id)
      .select(
        'assignment_submissions.id',
        'assignment_submissions.submission_text',
        'assignment_submissions.attachment_url',
        'assignment_submissions.grade',
        'assignment_submissions.feedback',
        'assignment_submissions.submitted_at',
        'assignment_submissions.status',
        db.raw('COALESCE(users.id, ?) as student_id', [null]),
        db.raw('COALESCE(users.first_name, ?) as first_name', ['Unknown']),
        db.raw('COALESCE(users.last_name, ?) as last_name', ['User']),
        db.raw('COALESCE(users.email, ?) as email', ['N/A']),
        db.raw('? as points', [assignment.points])
      );

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions',
    });
  }
};

// Grade assignment submission
export const gradeAssignment = async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to grade assignments',
      });
    }

    const submission = await db('assignment_submissions').where('id', req.params.submissionId).first();
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found',
      });
    }

    const assignment = await db('assignments').where('id', submission.assignment_id).first();
    const course = await db('courses').where('id', assignment.course_id).first();
    if (req.user.role === 'teacher' && course.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to grade this submission',
      });
    }

    const { grade, feedback } = req.body;

    const updatedSubmission = await db('assignment_submissions')
      .where('id', req.params.submissionId)
      .update(
        {
          grade,
          feedback,
          status: 'graded',
          graded_at: new Date(),
        },
        ['*']
      );

    res.status(200).json({
      success: true,
      data: updatedSubmission[0],
    });
  } catch (error) {
    console.error('Error grading submission:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to grade submission',
    });
  }
};