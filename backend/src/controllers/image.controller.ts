import { type Response } from 'express';
import { type AuthRequest } from '../middleware/auth.middleware';
import { Image } from '../models/Image';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, generateImageUrl } from '../config/aws';

export const uploadImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file',
      });
    }

    const { title, description } = req.body;
    const file = req.file as Express.MulterS3.File;

    // Create image record
    const image = await Image.create({
      title: title || '',
      description: description || '',
      s3Key: file.key,
      s3Url: generateImageUrl(file.key),
      uploadedBy: req.userId,
      fileSize: file.size,
      mimeType: file.mimetype,
    });

    // Populate user data
    await image.populate('uploadedBy', 'username email');

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: image,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image',
    });
  }
};

export const getAllImages = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const images = await Image.find()
      .populate('uploadedBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Image.countDocuments();

    res.json({
      success: true,
      data: {
        images,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Fetch images error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch images',
    });
  }
};

export const getUserImages = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const images = await Image.find({ uploadedBy: userId })
      .populate('uploadedBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Image.countDocuments({ uploadedBy: userId });

    res.json({
      success: true,
      data: {
        images,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Fetch user images error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user images',
    });
  }
};

export const deleteImage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Find image
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    // Check ownership
    if (image.uploadedBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this image',
      });
    }

    // Delete from S3
    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME not configured');
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: image.s3Key,
    });

    await s3Client.send(deleteCommand);

    // Delete from database
    await Image.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image',
    });
  }
};
