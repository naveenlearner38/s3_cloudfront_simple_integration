import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { imageService, type Image } from '../services/image.service';
import ImageCard from '../components/ImageCard';
import UploadModal from '../components/UploadModal';
import './Gallery.css';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'my'>('all');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response =
        filter === 'my' && user
          ? await imageService.getUserImages(user.id)
          : await imageService.getAllImages();
      setImages(response.data.images);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [filter]);

  const handleDelete = async (imageId: string) => {
    try {
      await imageService.deleteImage(imageId);
      setImages(images.filter((img) => img._id !== imageId));
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image');
    }
  };

  const handleUploadSuccess = () => {
    fetchImages();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="gallery-container">
      <header className="gallery-header">
        <div className="header-content">
          <div className="header-left">
            <h1>📸 Image Gallery</h1>
            <p className="header-subtitle">S3 & CloudFront Image Upload</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="username">{user?.username}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="gallery-controls">
        <div className="filter-tabs">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Images
          </button>
          <button
            className={filter === 'my' ? 'active' : ''}
            onClick={() => setFilter('my')}
          >
            My Images
          </button>
        </div>

        <button onClick={() => setShowUploadModal(true)} className="upload-btn">
          <span>➕</span> Upload Image
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading images...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🖼️</span>
          <h2>No images found</h2>
          <p>
            {filter === 'my'
              ? "You haven't uploaded any images yet"
              : 'Be the first to upload an image!'}
          </p>
          <button onClick={() => setShowUploadModal(true)} className="upload-btn-large">
            Upload Your First Image
          </button>
        </div>
      ) : (
        <div className="images-grid">
          {images.map((image) => (
            <ImageCard key={image._id} image={image} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default Gallery;
