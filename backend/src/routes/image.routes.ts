import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../config/aws';
import {
  uploadImage,
  getAllImages,
  getUserImages,
  deleteImage,
} from '../controllers/image.controller';

const router = Router();

/**
 * @route   POST /api/images
 * @desc    Upload a new image
 * @access  Private
 */
router.post('/', authenticate, upload.single('image'), uploadImage);

/**
 * @route   GET /api/images
 * @desc    Get all images (with pagination)
 * @access  Public
 */
router.get('/', getAllImages);

/**
 * @route   GET /api/images/user/:userId
 * @desc    Get images uploaded by a specific user
 * @access  Public
 */
router.get('/user/:userId', getUserImages);

/**
 * @route   DELETE /api/images/:id
 * @desc    Delete an image
 * @access  Private (Owner only)
 */
router.delete('/:id', authenticate, deleteImage);

export default router;
