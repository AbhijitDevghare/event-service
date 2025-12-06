require("dotenv").config();
const fs = require("fs");
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ,
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadMediaToCloudinary = async (localFilePath, folder = "ImpactLogProfile/Events") => {
  try {
    if (!localFilePath) return null;

    const fileSize = fs.statSync(localFilePath).size;
    const extension = path.extname(localFilePath).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.avif', '.mp4', '.mov', '.webm'];
    const MAX_FILE_SIZE_MB = 50;

    if (!allowedExtensions.includes(extension)) {
      console.error("Unsupported file type.");
      return null;
    }

    if (fileSize > MAX_FILE_SIZE_MB * 1024 * 1024) {
      console.error(`File size exceeds ${MAX_FILE_SIZE_MB} MB.`);
      return null;
    }

    const resourceType = extension === ".mp4" || extension === ".mov" || extension === ".webm" ? "video" : "image";

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      folder,
      allowed_formats: allowedExtensions.map(ext => ext.replace(".", "")),
      transformation: resourceType === "image" ? [{ width: 800, crop: "limit" }] : undefined
    });

    return {
      url: response.secure_url,
      type: resourceType,
      name: path.basename(localFilePath)
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  } finally {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
  }
};

module.exports = { uploadMediaToCloudinary };
