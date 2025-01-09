

import { v2 as cloudinary } from 'cloudinary';

import fs from 'fs';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload to Cloudinary
export const uploadImageToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'accommodations',
      allowedFormats: ['jpg', 'jpeg', 'png', 'mp4', 'avi', 'mov', 'mkv'],
      resource_type: 'auto', 
      public_id: `accommodation_${Date.now()}`,
    });

    return result.url;  // Use 'result.url' to store the Cloudinary URL in your DB
  } catch (error) {
    fs.unlinkSync(filePath); // Delete the file if upload fails
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/*

Cloudinary Storage Setup for Multer without saving to disk
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'accommodations',
      allowedFormats: 'jpeg,jpg,png,mp4,avi,mov,mkv',
      public_id: `accommodation_${Date.now()}`,
    };
  },
});
*/