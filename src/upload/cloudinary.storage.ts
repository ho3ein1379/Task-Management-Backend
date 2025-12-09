import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.config';

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    return {
      folder: 'task-manager',
      format: file.mimetype.split('/')[1],
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    };
  },
});
