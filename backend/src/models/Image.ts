import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
  title: string;
  description: string;
  s3Key: string;
  s3Url: string;
  uploadedBy: mongoose.Types.ObjectId;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IImage>(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    s3Key: {
      type: String,
      required: [true, 'S3 key is required'],
    },
    s3Url: {
      type: String,
      required: [true, 'S3 URL is required'],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
imageSchema.index({ uploadedBy: 1, createdAt: -1 });

export const Image = mongoose.model<IImage>('Image', imageSchema);
