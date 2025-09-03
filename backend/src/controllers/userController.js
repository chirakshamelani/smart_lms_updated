// src/controllers/userController.js
import { db } from '../database/db.js';
import bcrypt from 'bcrypt';

// Get all users (admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await db('users').select(
      'id',
      'username',
      'email',
      'first_name',
      'last_name',
      'role',
      'profile_picture',
      'bio',
      'is_active',
      'created_at'
    );

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Get single user
export const getUser = async (req, res) => {
  try {
    const hasIdParam = 'id' in req.params;
    const userId = hasIdParam ? parseInt(req.params.id, 10) : req.user.id;
    if (hasIdParam && Number.isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
      });
    }

    const user = await db('users')
      .where({ id: userId })
      .select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'profile_picture', 'bio', 'is_active', 'created_at')
      .first();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Create a new user (admin only)
export const createUser = async (req, res) => {
  try {
    const { username, email, first_name, last_name, password, role = 'student', bio, is_active = true } = req.body;

    if (!username || !email || !first_name || !last_name || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, first name, last name, and password are required',
      });
    }

    // Check if user already exists
    const existingUser = await db('users').where({ email }).orWhere({ username }).first();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or username already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const [newUserId] = await db('users').insert({
      username,
      email,
      first_name,
      last_name,
      password: hashedPassword,
      role,
      bio,
      is_active,
      created_at: new Date(),
    });

    const newUser = await db('users')
      .where({ id: newUserId })
      .select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'profile_picture', 'bio', 'is_active', 'created_at')
      .first();

    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Update user profile (excluding picture)
export const updateUser = async (req, res) => {
  try {
    const hasIdParam = 'id' in req.params;
    const userId = hasIdParam ? parseInt(req.params.id, 10) : req.user.id;
    if (hasIdParam && Number.isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
      });
    }

    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this user',
      });
    }

    const { first_name, last_name, bio, email, username } = req.body;

    const updateData = {};
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (bio !== undefined) updateData.bio = bio;
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No update data provided',
      });
    }

    // Check for unique email and username
    if (email || username) {
      const existingUser = await db('users')
        .where(function () {
          if (email) this.where('email', email);
          if (username) this.orWhere('username', username);
        })
        .whereNot('id', userId)
        .first();
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email or username already in use',
        });
      }
    }

    const count = await db('users').where({ id: userId }).update(updateData);

    if (count === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const updatedUser = await db('users')
      .where({ id: userId })
      .select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'profile_picture', 'bio', 'is_active', 'created_at')
      .first();

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('updateUser error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// Update profile picture
export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const profile_picture = `/Uploads/${req.file.filename}`;

    const count = await db('users').where({ id: userId }).update({ profile_picture });

    if (count === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const updatedUser = await db('users')
      .where({ id: userId })
      .select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'profile_picture', 'bio', 'is_active', 'created_at')
      .first();

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('updateProfilePicture error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to change this user\'s password',
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await db('users').where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (req.user.role !== 'admin') {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Current password is incorrect',
        });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db('users').where({ id: userId }).update({ password: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('changePassword error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
      });
    }

    const user = await db('users').where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    await db('users').where({ id: userId }).del();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Toggle user active status (admin only)
export const toggleUserStatus = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
      });
    }

    const { is_active } = req.body;
    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'is_active must be a boolean',
      });
    }

    const user = await db('users').where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    await db('users').where({ id: userId }).update({ is_active });

    const updatedUser = await db('users')
      .where({ id: userId })
      .select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'profile_picture', 'bio', 'is_active', 'created_at')
      .first();

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('toggleUserStatus error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};