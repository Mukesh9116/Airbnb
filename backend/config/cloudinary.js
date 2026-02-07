import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filepath) => {
  try {
    if (!filepath) return null;

    const uploadResult = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });

    fs.unlinkSync(filepath); 
    return uploadResult.secure_url;

  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    return null;
  }
};

export default uploadOnCloudinary;
