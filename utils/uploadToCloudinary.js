import cloudinary from './cloudinaryConfig.js';

export const uploadImageToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath);
    return result.url; // Store this URL in your MongoDB
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
