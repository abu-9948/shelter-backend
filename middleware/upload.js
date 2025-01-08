
import multer from 'multer';
import cloudinary from 'cloudinary';

// Directly import CloudinaryStorage or createCloudinaryStorage
import { CloudinaryStorage } from 'multer-storage-cloudinary'; // Access directly from named export

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,  // Pass the 'cloudinary' object
  params: {
    folder: 'accommodations',
    allowedFormats: ['jpg', 'jpeg', 'png'],
  },
});

// Multer Upload Middleware
const upload = multer({ storage: storage });

export default upload;
