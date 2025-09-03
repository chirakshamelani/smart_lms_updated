// src/routes/userRoutes.js
import express from 'express';
import { getUsers, getUser, createUser, updateUser, updateProfilePicture, changePassword, deleteUser, toggleUserStatus } from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/auth.js';
import multer from 'multer';
import path from 'path';

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/Uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, png, gif) are allowed'));
  },
});

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router
  .route('/')
  .get(authorize('admin'), getUsers)
  .post(authorize('admin'), createUser);

router
  .route('/profile')
  .get(getUser)
  .put(updateUser);

router.put('/profile-picture', upload.single('profile_picture'), updateProfilePicture);

router.put('/change-password', changePassword);

// Dynamic routes
router
  .route('/:id')
  .get(getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

router
  .route('/:id/status')
  .put(authorize('admin'), toggleUserStatus);

export default router;