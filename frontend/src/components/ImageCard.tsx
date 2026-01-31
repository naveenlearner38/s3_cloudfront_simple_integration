import React, { useState } from 'react';
import { type Image } from '../services/image.service';
import { useAuth } from '../context/AuthContext';
import './ImageCard.css';

interface ImageCardProps {
  image: Image;
  onDelete: (imageId: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete }) => {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const canDelete = user && user.id === image.uploadedBy._id;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setDeleting(true);
    try {
      await onDelete(image._id);
    } catch (error) {
      console.error('Delete failed:', error);
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="image-card">
        <div className="image-wrapper" onClick={() => setShowFullImage(true)}>
          <img src={image.s3Url} alt={image.title || 'Uploaded image'} loading="lazy" />
          <div className="image-overlay">
            <span>Click to view</span>
          </div>
        </div>

        <div className="image-info">
          {image.title && <h3 className="image-title">{image.title}</h3>}
          {image.description && <p className="image-description">{image.description}</p>}

          <div className="image-meta">
            <div className="meta-item">
              <span className="meta-icon">👤</span>
              <span>{image.uploadedBy.username}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <span>{formatDate(image.createdAt)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">💾</span>
              <span>{formatFileSize(image.fileSize)}</span>
            </div>
          </div>

          {canDelete && (
            <button
              className="delete-btn"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : '🗑️ Delete'}
            </button>
          )}
        </div>
      </div>

      {showFullImage && (
        <div className="fullscreen-overlay" onClick={() => setShowFullImage(false)}>
          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowFullImage(false)}>
              ✕
            </button>
            <img src={image.s3Url} alt={image.title || 'Uploaded image'} />
            {image.title && <h2>{image.title}</h2>}
            {image.description && <p>{image.description}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCard;
