import { api } from './api';

export interface Image {
  _id: string;
  title: string;
  description: string;
  s3Key: string;
  s3Url: string;
  uploadedBy: {
    _id: string;
    username: string;
    email: string;
  };
  fileSize: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImagesResponse {
  success: boolean;
  data: {
    images: Image[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: Image;
}

export const imageService = {
  getAllImages: async (page: number = 1, limit: number = 20): Promise<ImagesResponse> => {
    const response = await api.get<ImagesResponse>(`/api/images?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUserImages: async (userId: string, page: number = 1, limit: number = 20): Promise<ImagesResponse> => {
    const response = await api.get<ImagesResponse>(`/api/images/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  uploadImage: async (formData: FormData): Promise<UploadResponse> => {
    const response = await api.post<UploadResponse>('/api/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteImage: async (imageId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/images/${imageId}`);
    return response.data;
  },
};
